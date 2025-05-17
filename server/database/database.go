package database

import (
	"alqa/todo-app/models"
	"log"
	"os"


	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() *gorm.DB {
	dsn := os.Getenv("DB_DSN")
	if dsn == "" {
		dsn = "root@tcp(127.0.0.1:3306)/todo_db?charset=utf8mb4&parseTime=True&loc=Local"
	}
	
	log.Println("Connecting to database with DSN:", dsn)

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database")
	}

	DB = db
	return db
}

func Migrate(db *gorm.DB) {
	err := db.AutoMigrate(&models.Todo{})
	if err != nil {
		log.Fatal("Failed to migrate database")
	}
}
