package main

import (
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"log"
	"net/http"
	"server/database"
	"server/router"
)

func main() {

	err := database.ConnectDB()
	if err != nil {
		log.Fatal(err)
	}

	e := echo.New()

	e.Use(middleware.Gzip())

	e.Static("/", "../webapp/build")

	e.GET("/api/file/new", router.CreateFile)
	//e.POST("/api/file", router.CreateFile)
	e.GET("/api/ping", func(c echo.Context) error {
		return c.String(http.StatusOK, "pong")
	})

	e.Logger.Fatal(e.Start(":8080"))

}
