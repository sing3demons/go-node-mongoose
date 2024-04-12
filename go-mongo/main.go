package main

import (
	"net/http"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/sing3demons/productLanguage/handler"
	"github.com/sing3demons/productLanguage/kafka"
	"github.com/sing3demons/productLanguage/services"
)

func main() {
	godotenv.Load(".env.dev")

	client := ConnectMonoDB()
	database := client.Database("service_product")
	productHandler := handler.NewProductLanguage(database)

	e := echo.New()
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!")
	})

	e.GET("/productLanguage/:id", productHandler.FindProductLanguage)

	kafkaService := kafka.NewKafkaService(services.NewProductLanguageService(database))
	kafkaService.Consumer()

	e.Logger.Fatal(e.Start(":1323"))
}
