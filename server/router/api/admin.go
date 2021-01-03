package api

import (
	"context"
	"github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"net/http"
	"server/router"
	"server/util"
	"time"
)

func AdminLogin(c echo.Context) error {
	type LoginData struct {
		Password string `json:"password"`
	}

	req := new(LoginData)
	err := c.Bind(req)
	if err != nil {
		log.Println(err)
		res := new(router.ResponseError)
		res.Message = "Invalid Request"
		res.Documentation = "https://lifeni.github.io/i-show-you/api"
		return c.JSON(http.StatusBadRequest, &res)
	}

	if time.Now().Before(router.AdminBanAt.Add(router.AdminBanPeriod)) {
		res := new(router.ResponseError)
		res.Message = "Too Many Login Failures"
		res.Documentation = "https://lifeni.github.io/i-show-you/api"
		return c.JSON(http.StatusForbidden, &res)
	} else if router.AdminTryCount <= 0 {
		router.AdminTryCount = util.ConfigFile.App.Admin.TryCount
	}

	if req.Password != util.ConfigFile.Secret.Admin {
		router.AdminTryCount = router.AdminTryCount - 1
		if router.AdminTryCount <= 0 {
			router.AdminBanAt = time.Now()
		}

		log.Println(err)
		res := new(router.ResponseError)
		res.Message = "Permission Denied"
		res.Documentation = "https://lifeni.github.io/i-show-you/api"
		return c.JSON(http.StatusForbidden, &res)
	}

	router.AdminTryCount = util.ConfigFile.App.Admin.TryCount

	type ResponseData struct {
		Message string `json:"message"`
		Data    struct {
			Token string `json:"token"`
		} `json:"data"`
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"nbf": time.Now().Unix(),
	})

	tokenString, err := token.SignedString([]byte(util.ConfigFile.Secret.JwtKey.File))

	if err != nil {
		log.Println(err)
		res := new(router.ResponseError)
		res.Message = "Token Error"
		res.Documentation = "https://lifeni.github.io/i-show-you/api"
		return c.JSON(http.StatusInternalServerError, &res)
	}

	res := new(ResponseData)
	res.Message = "Welcome"
	res.Data.Token = tokenString

	return c.JSON(http.StatusOK, &res)
}

func QueryFileAdmin(c echo.Context) error {
	if !util.ConfigFile.App.Admin.Enable {
		res := new(router.ResponseError)
		res.Message = "Admin Page Not Open"
		res.Documentation = "https://lifeni.github.io/i-show-you/config"
		return c.JSON(http.StatusBadRequest, &res)
	}

	authentication := util.VerifyAdminToken(c)

	if !authentication {
		res := new(router.ResponseError)
		res.Message = "Permission Denied"
		res.Documentation = "https://lifeni.github.io/i-show-you/api"
		return c.JSON(http.StatusForbidden, &res)
	}

	opts := options.Find().SetSort(bson.D{{"updated_at", -1}})
	cursor, err := router.FileCollection.Find(context.TODO(), bson.D{{}}, opts)

	var results []router.FileData
	if err = cursor.All(context.TODO(), &results); err != nil {
		if err == mongo.ErrNoDocuments {
			log.Println(err)
			res := new(router.ResponseError)
			res.Message = "File Not Found"
			res.Documentation = "https://lifeni.github.io/i-show-you/api"
			return c.JSON(http.StatusNotFound, &res)
		}
		log.Println(err)
		res := new(router.ResponseError)
		res.Message = "Database Error"
		res.Documentation = "https://lifeni.github.io/i-show-you/api"
		return c.JSON(http.StatusInternalServerError, &res)
	}

	type ResponseData struct {
		Message string            `json:"message"`
		Data    []router.FileData `json:"data"`
	}

	res := new(ResponseData)
	res.Message = "Got it"
	res.Data = results
	return c.JSON(http.StatusOK, &res)
}

func RemoveFileAdmin(c echo.Context) error {
	id := c.Param("id")

	if !util.VerifyAdminToken(c) {
		res := new(router.ResponseError)
		res.Message = "Permission Denied"
		res.Documentation = "https://lifeni.github.io/i-show-you/api"
		return c.JSON(http.StatusForbidden, &res)
	}

	type QueryData struct {
		Id string `json:"id"`
	}

	_, err := router.FileCollection.DeleteOne(context.TODO(), QueryData{Id: id})
	if err != nil {
		if err == mongo.ErrNoDocuments {
			log.Println(err)
			res := new(router.ResponseError)
			res.Message = "File Not Found"
			res.Documentation = "https://lifeni.github.io/i-show-you/api"
			return c.JSON(http.StatusNotFound, &res)
		}

		log.Println(err)
		res := new(router.ResponseError)
		res.Message = "Database Error"
		res.Documentation = "https://lifeni.github.io/i-show-you/api"
		return c.JSON(http.StatusInternalServerError, &res)
	}

	type ResponseData struct {
		Message string `json:"message"`
	}

	res := new(ResponseData)
	res.Message = "Deleted"

	return c.JSON(http.StatusOK, &res)
}

func RemoveMultipleFilesAdmin(c echo.Context) error {
	if !util.VerifyAdminToken(c) {
		res := new(router.ResponseError)
		res.Message = "Permission Denied"
		res.Documentation = "https://lifeni.github.io/i-show-you/api"
		return c.JSON(http.StatusForbidden, &res)
	}

	type RemoveData struct {
		Files []string `json:"files"`
	}

	req := new(RemoveData)
	err := c.Bind(req)

	if err != nil {
		log.Println(err)
		res := new(router.ResponseError)
		res.Message = "Invalid Request"
		res.Documentation = "https://lifeni.github.io/i-show-you/api"
		return c.JSON(http.StatusBadRequest, &res)
	}

	_, err = router.FileCollection.DeleteMany(context.TODO(), bson.D{{"id", bson.D{{"$in", &req.Files}}}})
	if err != nil {
		if err == mongo.ErrNoDocuments {
			log.Println(err)
			res := new(router.ResponseError)
			res.Message = "File Not Found"
			res.Documentation = "https://lifeni.github.io/i-show-you/api"
			return c.JSON(http.StatusNotFound, &res)
		}

		log.Println(err)
		res := new(router.ResponseError)
		res.Message = "Database Error"
		res.Documentation = "https://lifeni.github.io/i-show-you/api"
		return c.JSON(http.StatusInternalServerError, &res)
	}

	type ResponseData struct {
		Message string `json:"message"`
	}

	res := new(ResponseData)
	res.Message = "Deleted"

	return c.JSON(http.StatusOK, &res)
}
