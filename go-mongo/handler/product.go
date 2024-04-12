package handler

import (
	"context"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/sing3demons/productLanguage/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type productLanguage struct {
	db *mongo.Database
}
type ProductLanguage interface {
	FindProductLanguage(c echo.Context) error
}

func NewProductLanguage(db *mongo.Database) ProductLanguage {
	return &productLanguage{db}
}

func (p *productLanguage) FindProductLanguage(c echo.Context) error {
	ctx, cancel := context.WithTimeout(c.Request().Context(), 10*time.Second)
	defer cancel()

	col := p.db.Collection("productLanguage")
	var product models.ProductLanguage
	if err := col.FindOne(ctx, bson.M{
		"deleteDate": nil,
		"id":         c.Param("id"),
	}).Decode(&product); err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}

	product.Href = "http://localhost:1323/productLanguage/" + product.ID

	return c.JSON(http.StatusOK, product)
}
