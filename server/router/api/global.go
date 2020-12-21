package api

import (
	"go.mongodb.org/mongo-driver/mongo"
	"server/database"
	"server/util"
)

type FileOptions struct {
	FontSize   string `json:"font_size"`
	LineHeight string `json:"line_height"`
	LineNumber bool   `json:"line_number"`
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

type FileData struct {
	Id        string `json:"id"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
	Name      string `json:"name"`
	Type      string `json:"type"`
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
