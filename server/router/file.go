package router

import (
	"context"
	"github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo"
	"github.com/satori/go.uuid"
	"go.mongodb.org/mongo-driver/mongo"
	"log"
	"net/http"
	"server/database"
	"server/util"
	"time"
)

type FileOptions struct {
	FontSize string `json:"font_size"`
}

type File struct {
	Id        string      `json:"id"`
	CreatedAt string      `json:"created_at"`
	UpdatedAt string      `json:"updated_at"`
	Name      string      `json:"name"`
	Type      string      `json:"type"`
	Content   string      `json:"content"`
	Options   FileOptions `json:"options"`
}

type RequestData struct {
	CreatedAt string      `json:"created_at"`
	UpdatedAt string      `json:"updated_at"`
	Name      string      `json:"name"`
	Type      string      `json:"type"`
	Content   string      `json:"content"`
	Options   FileOptions `json:"options"`
}

type ResponseError struct {
	Message       string `json:"message"`
	Documentation string `json:"documentation"`
}

var (
	FileCollection *mongo.Collection
	Config         *util.Config
)

func InitFileCollection() {
	FileCollection = database.GetCollection("file")
	Config = util.ConfigFile
}

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

	authentication := util.VerifyToken(c)

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
	return c.NoContent(http.StatusNotFound)
}

func RemoveFile(c echo.Context) error {
	id := c.Param("id")

	if util.VerifyToken(c) == "ghost" {
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
