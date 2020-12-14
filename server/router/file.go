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

type File struct {
	Id        uuid.UUID `json:"id"`
	CreatedAt string    `json:"created_at"`
	UpdatedAt string    `json:"updated_at"`
	Name      string    `json:"name"`
	Type      string    `json:"type"`
	Content   string    `json:"content"`
	Line      string    `json:"line"`
}

type RequestData struct {
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
	Name      string `json:"name"`
	Type      string `json:"type"`
	Content   string `json:"content"`
	Line      string `json:"line"`
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
	if err != nil {
		log.Fatal(err)
	}

	req := new(RequestData)
	if err = c.Bind(req); err != nil {
		log.Fatal(err)
	}

	result, err := FileCollection.InsertOne(context.TODO(), File{
		Id:        id,
		CreatedAt: req.CreatedAt,
		UpdatedAt: req.UpdatedAt,
		Name:      req.Name,
		Type:      req.Type,
		Content:   req.Content,
		Line:      req.Line,
	})

	if err != nil {
		log.Fatal(err)
	} else {
		log.Println(id, result)
	}

	type ResponseData struct {
		Message string `json:"message"`
		Data    struct {
			Id    uuid.UUID `json:"id"`
			Token string    `json:"token"`
		} `json:"data"`
	}

	res := new(ResponseData)
	res.Message = "ok"
	res.Data.Id = id
	res.Data.Token = tokenString

	return c.JSON(http.StatusOK, &res)
}

func QueryFile(c echo.Context) error {

	//return c.JSON(http.StatusOK, &file)
	data := ResponseError{
		Message:       "File Not Found",
		Documentation: "https://lifeni.github.io/i-show-you/api",
	}
	return c.JSON(http.StatusNotFound, &data)

}

func UpdateFile(c echo.Context) error {
	return c.NoContent(http.StatusNotFound)
}

func RemoveFile(c echo.Context) error {
	return c.NoContent(http.StatusNotFound)
}
