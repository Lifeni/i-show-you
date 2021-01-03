package api

import (
	"context"
	"github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo"
	"github.com/satori/go.uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"log"
	"net/http"
	"server/router"
	"server/util"
	"time"
)

func CreateFile(c echo.Context) error {
	id := uuid.NewV4()
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":  id,
		"nbf": time.Now().Unix(),
	})

	tokenString, err := token.SignedString([]byte(util.ConfigFile.Secret.JwtKey.File))

	req := new(router.RequestData)
	err = c.Bind(req)

	_, err = router.FileCollection.InsertOne(context.TODO(), router.File{
		Id:        id.String(),
		CreatedAt: req.CreatedAt,
		UpdatedAt: req.UpdatedAt,
		Name:      req.Name,
		Type:      req.Type,
		Content:   req.Content,
		Options:   req.Options,
	})

	if err != nil {
		log.Println(err)
		res := new(router.ResponseError)
		res.Message = "Database Error"
		res.Documentation = "https://lifeni.github.io/i-show-you/api"
		return c.JSON(http.StatusInternalServerError, &res)
	}

	type ResponseData struct {
		Message string `json:"message"`
		Data    struct {
			Id    uuid.UUID `json:"id"`
			Token string    `json:"token"`
		} `json:"data"`
	}

	res := new(ResponseData)
	res.Message = "Got it"
	res.Data.Id = id
	res.Data.Token = tokenString

	return c.JSON(http.StatusOK, &res)
}

func QueryFile(c echo.Context) error {
	id := c.Param("id")

	authentication := util.VerifyFileToken(c)

	type QueryData struct {
		Id string `json:"id"`
	}

	var file router.File

	err := router.FileCollection.FindOne(context.TODO(), QueryData{Id: id}).Decode(&file)
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
		Message        string      `json:"message"`
		Data           router.File `json:"data"`
		Authentication string      `json:"authentication"`
	}

	res := new(ResponseData)
	res.Message = "Got it"
	res.Data = file
	res.Authentication = authentication
	return c.JSON(http.StatusOK, &res)
}

func QueryRawFile(c echo.Context) error {

	id := c.Param("id")

	type QueryData struct {
		Id string `json:"id"`
	}

	var file router.File

	err := router.FileCollection.FindOne(context.TODO(), QueryData{Id: id}).Decode(&file)
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

	return c.String(http.StatusOK, file.Content)
}

func UpdateFile(c echo.Context) error {
	id := c.Param("id")

	if util.VerifyFileToken(c) == "ghost" {
		res := new(router.ResponseError)
		res.Message = "Permission Denied"
		res.Documentation = "https://lifeni.github.io/i-show-you/api"
		return c.JSON(http.StatusForbidden, &res)
	}

	type QueryData struct {
		Id string `json:"id"`
	}

	type UpdateData struct {
		UpdatedAt string             `json:"updated_at"`
		Name      string             `json:"name"`
		Type      string             `json:"type"`
		Content   string             `json:"content"`
		Options   router.FileOptions `json:"options"`
	}

	req := new(UpdateData)
	err := c.Bind(req)

	var pre router.File
	err = router.FileCollection.FindOneAndUpdate(context.TODO(), QueryData{Id: id}, bson.D{{"$set", &req}}).Decode(&pre)

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

	t, err := time.Parse(time.RFC3339, pre.UpdatedAt)

	if err != nil {
		log.Println(err)
		res := new(router.ResponseError)
		res.Message = "Database Error"
		res.Documentation = "https://lifeni.github.io/i-show-you/api"
		return c.JSON(http.StatusInternalServerError, &res)
	}

	if util.ConfigFile.App.History.Enable && time.Now().After(t.Add(router.ArchivePeriod)) && req.Content != pre.Content {
		_, err = router.HistoryCollection.InsertOne(context.TODO(), &pre)

		if err != nil {
			log.Println(err)
			res := new(router.ResponseError)
			res.Message = "Database Error"
			res.Documentation = "https://lifeni.github.io/i-show-you/api"
			return c.JSON(http.StatusInternalServerError, &res)
		}
	}

	type ResponseData struct {
		Message string `json:"message"`
	}

	res := new(ResponseData)
	res.Message = "Updated"

	return c.JSON(http.StatusOK, &res)
}

func UpdateFilePatch(c echo.Context) error {
	id, key := c.Param("id"), c.Param("key")

	if util.VerifyFileToken(c) == "ghost" {
		res := new(router.ResponseError)
		res.Message = "Permission Denied"
		res.Documentation = "https://lifeni.github.io/i-show-you/api"
		return c.JSON(http.StatusForbidden, &res)
	}

	type QueryData struct {
		Id string `json:"id"`
	}

	var err error
	var pre router.File

	flag := false

	if key == "name" {
		type UpdateData struct {
			Name      string `json:"name"`
			Type      string `json:"type"`
			UpdatedAt string `json:"updated_at"`
		}

		req := new(UpdateData)
		err = c.Bind(req)

		if err != nil {
			log.Println(err)
			res := new(router.ResponseError)
			res.Message = "Invalid Request"
			res.Documentation = "https://lifeni.github.io/i-show-you/api"
			return c.JSON(http.StatusBadRequest, &res)
		}

		err = router.FileCollection.FindOneAndUpdate(context.TODO(), QueryData{Id: id}, bson.D{{"$set", &req}}).Decode(&pre)
	} else if key == "content" {
		type UpdateData struct {
			Content   string `json:"content"`
			UpdatedAt string `json:"updated_at"`
		}

		req := new(UpdateData)
		err = c.Bind(req)

		if err != nil {
			log.Println(err)
			res := new(router.ResponseError)
			res.Message = "Invalid Request"
			res.Documentation = "https://lifeni.github.io/i-show-you/api"
			return c.JSON(http.StatusBadRequest, &res)
		}

		flag = true
		err = router.FileCollection.FindOneAndUpdate(context.TODO(), QueryData{Id: id}, bson.D{{"$set", &req}}).Decode(&pre)
	} else if key == "options" {
		type UpdateData struct {
			Options router.FileOptions `json:"options"`
		}

		req := new(UpdateData)
		err = c.Bind(req)

		if err != nil {
			log.Println(err)
			res := new(router.ResponseError)
			res.Message = "Invalid Request"
			res.Documentation = "https://lifeni.github.io/i-show-you/api"
			return c.JSON(http.StatusBadRequest, &res)
		}

		err = router.FileCollection.FindOneAndUpdate(context.TODO(), QueryData{Id: id}, bson.D{{"$set", &req}}).Decode(&pre)
	} else {
		log.Println(err)
		res := new(router.ResponseError)
		res.Message = "Invalid Request"
		res.Documentation = "https://lifeni.github.io/i-show-you/api"
		return c.JSON(http.StatusBadRequest, &res)
	}

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

	t, err := time.Parse(time.RFC3339, pre.UpdatedAt)

	if err != nil {
		log.Println(err)
		res := new(router.ResponseError)
		res.Message = "Database Error"
		res.Documentation = "https://lifeni.github.io/i-show-you/api"
		return c.JSON(http.StatusInternalServerError, &res)
	}

	if util.ConfigFile.App.History.Enable && time.Now().After(t.Add(router.ArchivePeriod)) && flag {
		_, err = router.HistoryCollection.InsertOne(context.TODO(), &pre)

		if err != nil {
			log.Println(err)
			res := new(router.ResponseError)
			res.Message = "Database Error"
			res.Documentation = "https://lifeni.github.io/i-show-you/api"
			return c.JSON(http.StatusInternalServerError, &res)
		}
	}

	type ResponseData struct {
		Message string `json:"message"`
	}

	res := new(ResponseData)
	res.Message = "Updated"

	return c.JSON(http.StatusOK, &res)
}

func RemoveFile(c echo.Context) error {
	id := c.Param("id")

	if util.VerifyFileToken(c) == "ghost" {
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
		res.Message = "Database Error (File)"
		res.Documentation = "https://lifeni.github.io/i-show-you/api"
		return c.JSON(http.StatusInternalServerError, &res)
	}

	_, err = router.HistoryCollection.DeleteMany(context.TODO(), QueryData{Id: id})
	if err != nil {
		log.Println(err)
		res := new(router.ResponseError)
		res.Message = "Database Error (History)"
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
