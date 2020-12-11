package main

import (
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"io/ioutil"
	"log"
	"net/http"
	"regexp"
	"server/database"
	"server/router"
)

func main() {
	e := echo.New()
	e.Use(middleware.Gzip())

	_, err := ioutil.ReadFile("./configs/main.yml")
	if err != nil {
		e.File("/", "./welcome.html")
		e.File("/favicon.ico", "./public/favicon.ico")
		e.File("/logo.svg", "./public/assets/logo.svg")
	} else {
		err := database.ConnectDB()
		if err != nil {
			log.Fatal(err)
		}

		e.Static("/", "./public/")
		e.GET("/:path", func(c echo.Context) error {
			path := c.Param("path")
			matched, err := regexp.MatchString(`(.*)\.(txt|ico|json)`, path)
			if err == nil && matched {
				return c.File("./public/" + c.Param("path"))
			}
			return c.File("./public/index.html")
		})

		api := e.Group("/api")

		api.GET("/file/:id", router.QueryFile)
		api.POST("/file", router.CreateFile)
		api.PUT("/file/:id", router.UpdateFile)
		api.DELETE("/file/:id", router.RemoveFile)

		api.GET("/ping", func(c echo.Context) error {
			return c.String(http.StatusOK, "pong")
		})
	}

	e.Logger.Fatal(e.Start(":8080"))
}
