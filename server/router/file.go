package router

import (
	"context"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo"
	"github.com/satori/go.uuid"
	"go.mongodb.org/mongo-driver/mongo"
	"log"
	"net/http"
	"server/database"
	"server/util"
	"strings"
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
	var tokenString string
	if c.Request().Header.Get("Authorization") != "" {
		tokenString = strings.Split(c.Request().Header.Get("Authorization"), " ")[1]
	} else {
		tokenString = ""
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(Config.Server.JwtSecret.File), nil
	})

	authentication := "ghost"

	if err == nil {
		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			if claims["id"] == id {
				authentication = "owner"
			}
		}
	}

	type QueryData struct {
		Id string `json:"id"`
	}

	var file File

	err = FileCollection.FindOne(context.TODO(), QueryData{Id: id}).Decode(&file)
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
	return c.NoContent(http.StatusNotFound)
}
