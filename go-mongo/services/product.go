package services

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/sing3demons/productLanguage/models"
	"go.mongodb.org/mongo-driver/mongo"
)

type productLanguageService struct {
	db *mongo.Database
}

func NewProductLanguageService(db *mongo.Database) Service {
	return &productLanguageService{db}
}

func (p *productLanguageService) CreateProductLanguage(data []byte) error {
	var product models.ProductLanguage
	if err := json.Unmarshal(data, &product); err != nil {
		fmt.Printf("error while unMarshalling message: %s", err.Error())
		return err
	}

	r, err := p.db.Collection("productLanguage").InsertOne(context.Background(), product)
	if err != nil {
		fmt.Printf("error while inserting message: %s", err.Error())
		return err
	}
	fmt.Printf("inserted document with ID %v\n", r.InsertedID)
	return nil
}
