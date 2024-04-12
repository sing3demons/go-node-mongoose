package kafka

import (
	"context"
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/segmentio/kafka-go"
	"github.com/sing3demons/productLanguage/services"
)

type KafkaService struct {
	topics []string
	svc    services.Service
	group  string
}

func NewKafkaService(svc services.Service) *KafkaService {
	kafkaTopic := os.Getenv("KAFKA_TOPICS")
	topics := strings.Split(kafkaTopic, ",")
	group := os.Getenv("KAFKA_GROUP")
	if group == "" {
		group = "client-1"
	}
	return &KafkaService{
		topics: topics,
		svc:    svc,
		group:  group,
	}
}

func (k *KafkaService) Consumer() {
	go func() {
		kConf := kafkaReader(k.topics, k.group)
		reader := kafka.NewReader(kConf)
		defer reader.Close()

		for {
			m, err := reader.ReadMessage(context.Background())
			if err != nil {
				fmt.Printf("error while receiving message: %s", err.Error())
				continue
			}

			fmt.Printf("[topic:partition:offset %v:%v:%v:]\n", m.Topic, m.Partition, m.Offset)
			switch m.Topic {
			case "createProductLanguage":
				k.svc.CreateProductLanguage(m.Value)
			}
		}
	}()
}

func kafkaReader(topics []string, group string) kafka.ReaderConfig {
	return kafka.ReaderConfig{
		Brokers: []string{"127.0.0.1:9092"},
		GroupID: group,
		// Topic:           topic,
		GroupTopics:     topics,
		MinBytes:        10e3,            // 10KB
		MaxBytes:        10e6,            // 10MB
		MaxWait:         1 * time.Second, // Maximum amount of time to wait for new data to come when fetching batches of messages from kafka.
		ReadLagInterval: -1,
	}
}
