package router

import (
	"github.com/labstack/echo"
	"github.com/satori/go.uuid"
	"net/http"
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

func CreateFile(c echo.Context) error {
	//f := new(File)
	//if err := c.Bind(f); err != nil {
	//	return err
	//}

	var content struct {
		Message string    `json:"message"`
		ID      uuid.UUID `json:"id"`
	}

	id := uuid.NewV4()

	content.Message = "Ok"
	content.ID = id

	return c.JSON(http.StatusOK, &content)
}
