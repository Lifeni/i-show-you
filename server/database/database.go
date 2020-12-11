package database

import (
	"context"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
	"log"
	"time"
)

var (
	Client *mongo.Client
)

func ConnectDB() error {
	var err error

	Client, err = mongo.NewClient(options.Client().ApplyURI("mongodb://mongo:27017"))
	if err != nil {
		return err
	}
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	err = Client.Connect(ctx)
	if err != nil {
		return err
	}

	err = Client.Ping(ctx, readpref.Primary())
	if err != nil {
		log.Println("Unable to connect to database")
		return err
	}
	log.Println("Connected to database")

	return err
}
