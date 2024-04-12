package services

type Service interface {
	CreateProductLanguage(data []byte) error
}
