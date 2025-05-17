package models

import (
	"time"

	"gorm.io/gorm"
)

type Todo struct {
	gorm.Model
	Title     string    `json:"title"`
	Completed bool      `json:"completed"`
	DueDate   time.Time `json:"due_date"`
}
