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
		res := new(ResponseError)
		res.Message = "Invalid Request"
		res.Documentation = "https://lifeni.github.io/i-show-you/api"
		return c.JSON(http.StatusBadRequest, &res)
	}

	if req.Password != Config.Admin.Password {
		log.Println(err)
		res := new(ResponseError)
		res.Message = "Permission Denied"
		res.Documentation = "https://lifeni.github.io/i-show-you/api"
		return c.JSON(http.StatusForbidden, &res)
	}

	type ResponseData struct {
		Message string `json:"message"`
		Data    struct {
			Token string `json:"token"`
		} `json:"data"`
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"nbf": time.Now().Unix(),
	})

	tokenString, err := token.SignedString([]byte(Config.Server.JwtSecret.File))

	if err != nil {
		log.Println(err)
		res := new(ResponseError)
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
	authentication := util.VerifyAdminToken(c)

	if !authentication {
		res := new(ResponseError)
		res.Message = "Permission Denied"
		res.Documentation = "https://lifeni.github.io/i-show-you/api"
		return c.JSON(http.StatusForbidden, &res)
	}

	opts := options.Find().SetSort(bson.D{{"updated_at", -1}})
	cursor, err := FileCollection.Find(context.TODO(), bson.D{{}}, opts)

	var results []FileData
	if err = cursor.All(context.TODO(), &results); err != nil {
		if err == mongo.ErrNoDocuments {
			log.Println(err)
			res := new(ResponseError)
			res.Message = "File Not Found"
			res.Documentation = "https://lifeni.github.io/i-show-you/api"
			return c.JSON(http.StatusNotFound, &res)
		}
		log.Println(err)
		res := new(ResponseError)
		res.Message = "Database Error"
		res.Documentation = "https://lifeni.github.io/i-show-you/api"
		return c.JSON(http.StatusInternalServerError, &res)
	}

	type ResponseData struct {
		Message string     `json:"message"`
		Data    []FileData `json:"data"`
	}

	res := new(ResponseData)
	res.Message = "Got it"
	res.Data = results
	return c.JSON(http.StatusOK, &res)
}

func RemoveFileAdmin(c echo.Context) error {
	id := c.Param("id")

	if !util.VerifyAdminToken(c) {
		res := new(ResponseError)
		res.Message = "Permission Denied"
		res.Documentation = "https://lifeni.github.io/i-show-you/api"
		return c.JSON(http.StatusUnauthorized, &res)
	}

	type QueryData struct {
		Id string `json:"id"`
	}

	_, err := FileCollection.DeleteOne(context.TODO(), QueryData{Id: id})
	if err != nil {
		if err == mongo.ErrNoDocuments {
			log.Println(err)
			res := new(ResponseError)
			res.Message = "File Not Found"
			res.Documentation = "https://lifeni.github.io/i-show-you/api"
			return c.JSON(http.StatusNotFound, &res)
		}

		log.Println(err)
		res := new(ResponseError)
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
		res := new(ResponseError)
		res.Message = "Permission Denied"
		res.Documentation = "https://lifeni.github.io/i-show-you/api"
		return c.JSON(http.StatusUnauthorized, &res)
	}

	type RemoveData struct {
		Files []string `json:"files"`
	}

	req := new(RemoveData)
	err := c.Bind(req)

	if err != nil {
		log.Println(err)
		res := new(ResponseError)
		res.Message = "Invalid Request"
		res.Documentation = "https://lifeni.github.io/i-show-you/api"
		return c.JSON(http.StatusBadRequest, &res)
	}

	_, err = FileCollection.DeleteMany(context.TODO(), bson.D{{"id", bson.D{{"$in", &req.Files}}}})
	if err != nil {
		if err == mongo.ErrNoDocuments {
			log.Println(err)
			res := new(ResponseError)
			res.Message = "File Not Found"
			res.Documentation = "https://lifeni.github.io/i-show-you/api"
			return c.JSON(http.StatusNotFound, &res)
		}

		log.Println(err)
		res := new(ResponseError)
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
