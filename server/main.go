package main

import (
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"io/ioutil"
	"log"
	"net/http"
	"regexp"
	"server/database"
	apiRouter "server/router/api"
	websocketRouter "server/router/websocket"
	"server/util"
)

func main() {
	e := echo.New()
	e.Use(middleware.Gzip())

	_, err := ioutil.ReadFile("./configs/main.yml")
	if err != nil {
		e.File("/", "./public/welcome.html")
		e.File("/favicon.ico", "./public/favicon.ico")
		e.File("/logo.svg", "./public/assets/logo.svg")
	} else {
		err := database.ConnectDB()
		if err != nil {
			log.Fatal(err)
		}

		util.InitConfig()
		apiRouter.InitFileCollection()

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

		api.GET("/file/:id", apiRouter.QueryFile)
		api.GET("/file/:id/raw", apiRouter.QueryRawFile)
		api.POST("/file", apiRouter.CreateFile)
		api.PUT("/file/:id", apiRouter.UpdateFile)
		api.PATCH("/file/:id/:key", apiRouter.UpdateFilePatch)
		api.DELETE("/file/:id", apiRouter.RemoveFile)

		api.GET("/admin", apiRouter.QueryFileAdmin)
		api.POST("/admin", apiRouter.AdminLogin)
		api.DELETE("/admin/file/:id", apiRouter.RemoveFileAdmin)
		api.DELETE("/admin/files", apiRouter.RemoveMultipleFilesAdmin)

		api.GET("/ping", func(c echo.Context) error {
			return c.String(http.StatusOK, "pong")
		})

		websocket := e.Group("/websocket")
		websocket.GET("/file/:id", websocketRouter.FetchFile)
		websocket.GET("/ping", func(c echo.Context) error {
			return c.String(http.StatusOK, "pong")
		})
	}

	e.Logger.Fatal(e.Start(":8080"))
}
