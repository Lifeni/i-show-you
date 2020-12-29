package router

import (
	"go.mongodb.org/mongo-driver/mongo"
	"server/database"
	"server/util"
	"time"
)

type FileOptions struct {
	AutoSave   bool   `json:"auto_save"`
	WordWrap   bool   `json:"word_wrap"`
	FontFamily string `json:"font_family"`
	FontSize   int    `json:"font_size"`
	LineHeight int    `json:"line_height"`
	UpdatedAt  string `json:"updated_at"`
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
	FileCollection    *mongo.Collection
	HistoryCollection *mongo.Collection
	ArchivePeriod     time.Duration
	AdminTryCount     int
	AdminBanPeriod    time.Duration
	AdminBanAt        time.Time
)

func Init() {
	FileCollection = database.GetCollection("file")
	HistoryCollection = database.GetCollection("history")
	ArchivePeriod = time.Duration(util.ConfigFile.App.History.SavePeriod) * time.Second
	AdminTryCount = util.ConfigFile.App.Admin.TryCount
	AdminBanPeriod = time.Duration(util.ConfigFile.App.Admin.BanPeriod) * time.Minute
	AdminBanAt = time.Now().Add(-AdminBanPeriod)
}
