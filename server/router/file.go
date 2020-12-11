package router

import (
	"github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo"
	"github.com/satori/go.uuid"
	"log"
	"net/http"
	"server/util"
	"time"
)

type File struct {
	Name    string `json:"name"`
	Type    string `json:"type"`
	Content string `json:"content"`
	Options struct {
		Slug string `json:"slug"`
		Sync string `json:"sync"`
	}
}

type ResponseData struct {
	Message string   `json:"message"`
	Data    struct{} `json:"data"`
}
type ResponseError struct {
	Message       string `json:"message"`
	Documentation string `json:"documentation"`
}

func CreateFile(c echo.Context) error {
	id := uuid.NewV4()

	config := util.GetConfig()

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":  id,
		"nbf": time.Now().Unix(),
	})

	tokenString, err := token.SignedString([]byte(config.Server.JwtSecret.File))
	if err != nil {
		log.Fatal(err)
	}

	var data struct {
		Message string    `json:"message"`
		ID      uuid.UUID `json:"id"`
		Token   string    `json:"token"`
	}

	// TODO db operation insert
	// TODO error handle
	data.Message = "Ok"
	data.ID = id
	data.Token = tokenString

	return c.JSON(http.StatusOK, &data)
}

func QueryFile(c echo.Context) error {
	//var file struct {
	//	Name    string `json:"name"`
	//	Type    string `json:"type"`
	//	Content string `json:"content"`
	//	Options struct {
	//		Slug string `json:"slug"`
	//		Sync string `json:"sync"`
	//	}
	//}
	// TODO db operation find

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
