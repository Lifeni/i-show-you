package api

import (
	"context"
	"github.com/labstack/echo"
	"log"
	"net/http"
)

func QueryFileHistory(c echo.Context) error {
	id := c.Param("id")

	type QueryData struct {
		Id string `json:"id"`
	}

	var files []File

	cursor, err := HistoryCollection.Find(context.TODO(), QueryData{Id: id})
	if err != nil {
		log.Println(err)
		res := new(ResponseError)
		res.Message = "Database Error"
		res.Documentation = "https://lifeni.github.io/i-show-you/api"
		return c.JSON(http.StatusInternalServerError, &res)
	}

	if err = cursor.All(context.TODO(), &files); err != nil {
		log.Println(err)
		res := new(ResponseError)
		res.Message = "Database Error"
		res.Documentation = "https://lifeni.github.io/i-show-you/api"
		return c.JSON(http.StatusInternalServerError, &res)
	}

	if len(files) == 0 {
		log.Println(err)
		res := new(ResponseError)
		res.Message = "File Not Found"
		res.Documentation = "https://lifeni.github.io/i-show-you/api"
		return c.JSON(http.StatusNotFound, &res)
	}

	type ResponseData struct {
		Message string `json:"message"`
		Data    []File `json:"data"`
	}

	res := new(ResponseData)
	res.Message = "Got it"
	res.Data = files
	return c.JSON(http.StatusOK, &res)
}
