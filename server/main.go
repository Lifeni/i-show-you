package main

import (
	"github.com/joho/godotenv"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"log"
	"net/http"
	"server/database"
	"server/router"
)

func main() {

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	err = database.ConnectDB()
	if err != nil {
		log.Fatal(err)
	}

	e := echo.New()

	e.Use(middleware.Gzip())

	e.Static("/", "../webapp/build")

	e.GET("/api/file/:id", router.QueryFile)
	e.POST("/api/file", router.CreateFile)
	e.PUT("/api/file/:id", router.UpdateFile)
	e.DELETE("/api/file/:id", router.RemoveFile)

	e.GET("/api/ping", func(c echo.Context) error {
		return c.String(http.StatusOK, "pong")
	})

	e.Logger.Fatal(e.Start(":8080"))

}
