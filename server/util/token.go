package util

import (
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo"
	"strings"
)

func VerifyToken(c echo.Context) string {
	id := c.Param("id")
	var tokenString string
	if c.Request().Header.Get("Authorization") != "" {
		tokenString = strings.Split(c.Request().Header.Get("Authorization"), " ")[1]
	} else {
		tokenString = "no-token"
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(ConfigFile.Server.JwtSecret.File), nil
	})

	authentication := "ghost"

	if err == nil {
		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			if claims["id"] == id {
				authentication = "owner"
			}
		}
	}

	return authentication
}
