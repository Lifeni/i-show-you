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
	"server/util"
	"time"
)

var (
	archivePeriod = 60 * time.Second
)

func CreateFile(c echo.Context) error {
	id := uuid.NewV4()
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":  id,
		"nbf": time.Now().Unix(),
	})

	tokenString, err := token.SignedString([]byte(Config.Server.JwtSecret.File))

	req := new(RequestData)
	err = c.Bind(req)

	_, err = FileCollection.InsertOne(context.TODO(), File{
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
		res := new(ResponseError)
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

	var file File

	err := FileCollection.FindOne(context.TODO(), QueryData{Id: id}).Decode(&file)
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
		Message        string `json:"message"`
		Data           File   `json:"data"`
		Authentication string `json:"authentication"`
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

	var file File

	err := FileCollection.FindOne(context.TODO(), QueryData{Id: id}).Decode(&file)
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

	return c.String(http.StatusOK, file.Content)
}

func UpdateFile(c echo.Context) error {
	id := c.Param("id")

	if util.VerifyFileToken(c) == "ghost" {
		res := new(ResponseError)
		res.Message = "Permission Denied"
		res.Documentation = "https://lifeni.github.io/i-show-you/api"
		return c.JSON(http.StatusUnauthorized, &res)
	}

	type QueryData struct {
		Id string `json:"id"`
	}

	type UpdateData struct {
		UpdatedAt string      `json:"updated_at"`
		Name      string      `json:"name"`
		Type      string      `json:"type"`
		Content   string      `json:"content"`
		Options   FileOptions `json:"options"`
	}

	req := new(UpdateData)
	err := c.Bind(req)

	var pre File
	err = FileCollection.FindOneAndUpdate(context.TODO(), QueryData{Id: id}, bson.D{{"$set", &req}}).Decode(&pre)

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

	t, err := time.Parse(time.RFC3339, pre.UpdatedAt)

	if err != nil {
		log.Println(err)
		res := new(ResponseError)
		res.Message = "Database Error"
		res.Documentation = "https://lifeni.github.io/i-show-you/api"
		return c.JSON(http.StatusInternalServerError, &res)
	}

	if time.Now().After(t.Add(archivePeriod)) && req.Content != pre.Content {
		_, err = HistoryCollection.InsertOne(context.TODO(), &pre)

		if err != nil {
			log.Println(err)
			res := new(ResponseError)
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
		res := new(ResponseError)
		res.Message = "Permission Denied"
		res.Documentation = "https://lifeni.github.io/i-show-you/api"
		return c.JSON(http.StatusUnauthorized, &res)
	}

	type QueryData struct {
		Id string `json:"id"`
	}

	var err error
	var pre File

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
			res := new(ResponseError)
			res.Message = "Invalid Request"
			res.Documentation = "https://lifeni.github.io/i-show-you/api"
			return c.JSON(http.StatusBadRequest, &res)
		}

		err = FileCollection.FindOneAndUpdate(context.TODO(), QueryData{Id: id}, bson.D{{"$set", &req}}).Decode(&pre)
	} else if key == "content" {
		type UpdateData struct {
			Content   string `json:"content"`
			UpdatedAt string `json:"updated_at"`
		}

		req := new(UpdateData)
		err = c.Bind(req)

		if err != nil {
			log.Println(err)
			res := new(ResponseError)
			res.Message = "Invalid Request"
			res.Documentation = "https://lifeni.github.io/i-show-you/api"
			return c.JSON(http.StatusBadRequest, &res)
		}

		flag = true
		err = FileCollection.FindOneAndUpdate(context.TODO(), QueryData{Id: id}, bson.D{{"$set", &req}}).Decode(&pre)
	} else if key == "options" {
		type UpdateData struct {
			Options FileOptions `json:"options"`
		}

		req := new(UpdateData)
		err = c.Bind(req)

		if err != nil {
			log.Println(err)
			res := new(ResponseError)
			res.Message = "Invalid Request"
			res.Documentation = "https://lifeni.github.io/i-show-you/api"
			return c.JSON(http.StatusBadRequest, &res)
		}

		err = FileCollection.FindOneAndUpdate(context.TODO(), QueryData{Id: id}, bson.D{{"$set", &req}}).Decode(&pre)
	} else {
		log.Println(err)
		res := new(ResponseError)
		res.Message = "Invalid Request"
		res.Documentation = "https://lifeni.github.io/i-show-you/api"
		return c.JSON(http.StatusBadRequest, &res)
	}

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

	t, err := time.Parse(time.RFC3339, pre.UpdatedAt)

	if err != nil {
		log.Println(err)
		res := new(ResponseError)
		res.Message = "Database Error"
		res.Documentation = "https://lifeni.github.io/i-show-you/api"
		return c.JSON(http.StatusInternalServerError, &res)
	}

	if time.Now().After(t.Add(archivePeriod)) && flag {
		_, err = HistoryCollection.InsertOne(context.TODO(), &pre)

		if err != nil {
			log.Println(err)
			res := new(ResponseError)
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
