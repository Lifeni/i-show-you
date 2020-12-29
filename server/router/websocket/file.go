package router

import (
	"context"
	"github.com/gorilla/websocket"
	"github.com/labstack/echo"
	"log"
	"server/router"
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

var (
	upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
	}
)

const (
	writeWait    = 10 * time.Second
	pongWait     = 60 * time.Second
	pingPeriod   = (pongWait * 9) / 10
	filePeriod   = 1 * time.Second
	optionPeriod = 2 * time.Second
)

func checkModified(id string) (File, bool) {
	type QueryData struct {
		Id string `json:"id"`
	}

	var file File

	err := router.FileCollection.FindOne(context.TODO(), QueryData{Id: id}).Decode(&file)

	t, err := time.Parse(time.RFC3339, file.UpdatedAt)
	ot, err := time.Parse(time.RFC3339, file.Options.UpdatedAt)
	nt := time.Now()

	if err != nil {
		return file, false
	}

	if nt.After(t.Add(filePeriod)) && nt.After(ot.Add(optionPeriod)) {
		return file, false
	}

	return file, true
}

func reader(ws *websocket.Conn) {
	defer ws.Close()
	ws.SetReadLimit(512)
	err := ws.SetReadDeadline(time.Now().Add(pongWait))
	ws.SetPongHandler(func(string) error {
		err = ws.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})
	for {
		_, _, err := ws.ReadMessage()
		if err != nil {
			break
		}
	}
}

func writer(ws *websocket.Conn, id string) {

	pingTicker := time.NewTicker(pingPeriod)
	fileTicker := time.NewTicker(filePeriod)
	defer func() {
		pingTicker.Stop()
		fileTicker.Stop()
		_ = ws.Close()
	}()
	for {
		select {
		case <-fileTicker.C:
			var p File
			var up bool

			p, up = checkModified(id)
			if up {
				err := ws.SetWriteDeadline(time.Now().Add(writeWait))
				if err = ws.WriteJSON(p); err != nil {
					return
				}
			}
		case <-pingTicker.C:
			err := ws.SetWriteDeadline(time.Now().Add(writeWait))
			if err = ws.WriteMessage(websocket.PingMessage, []byte{}); err != nil {
				return
			}
		}
	}
}

func FetchFile(c echo.Context) error {
	id := c.Param("id")

	ws, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
	if err != nil {
		if _, ok := err.(websocket.HandshakeError); !ok {
			log.Println(err)
		}
		return err
	}

	go writer(ws, id)
	reader(ws)
	return err
}
