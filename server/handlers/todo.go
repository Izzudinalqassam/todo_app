package handlers

import (
	"alqa/todo-app/database"
	"alqa/todo-app/models"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

// ToDoResponse converts a Todo model to a TodoResponse
func ToDoResponse(todo models.Todo) models.TodoResponse {
	return models.TodoResponse{
		ID:        todo.ID,
		Title:     todo.Title,
		Completed: todo.Completed,
		DueDate:   todo.DueDate,
		CreatedAt: todo.CreatedAt,
		UpdatedAt: todo.UpdatedAt,
	}
}

// GetTodos returns all todos
func GetTodos(c *gin.Context) {
	var todos []models.Todo
	if err := database.DB.Find(&todos).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch todos"})
		return
	}

	// Convert todos to response format
	var response []models.TodoResponse
	for _, todo := range todos {
		response = append(response, ToDoResponse(todo))
	}

	c.JSON(http.StatusOK, response)
}

// CreateTodo creates a new todo
func CreateTodo(c *gin.Context) {
	var input models.CreateTodoRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Parse due date if provided
	var dueDate time.Time
	var err error
	if input.DueDate != "" {
		dueDate, err = time.Parse(time.RFC3339, input.DueDate)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format. Use RFC3339 format (e.g., 2023-01-02T15:04:05Z07:00)"})
			return
		}
	} else {
		dueDate = time.Now().Add(24 * time.Hour) // Default to tomorrow
	}

	todo := models.Todo{
		Title:   input.Title,
		DueDate: dueDate,
	}

	if err := database.DB.Create(&todo).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create todo"})
		return
	}

	c.JSON(http.StatusCreated, ToDoResponse(todo))
}

// UpdateTodo updates a todo
func UpdateTodo(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var input models.UpdateTodoRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var todo models.Todo
	if err := database.DB.First(&todo, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Todo not found"})
		return
	}

	// Update fields if they are provided in the request
	updates := make(map[string]interface{})
	if input.Title != nil {
		updates["title"] = *input.Title
	}
	if input.Completed != nil {
		updates["completed"] = *input.Completed
	}
	if input.DueDate != nil {
		dueDate, err := time.Parse(time.RFC3339, *input.DueDate)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format. Use RFC3339 format (e.g., 2023-01-02T15:04:05Z07:00)"})
			return
		}
		updates["due_date"] = dueDate
	}

	if err := database.DB.Model(&todo).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update todo"})
		return
	}

	c.JSON(http.StatusOK, ToDoResponse(todo))
}

// DeleteTodo deletes a todo
func DeleteTodo(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var todo models.Todo
	if err := database.DB.First(&todo, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Todo not found"})
		return
	}

	if err := database.DB.Delete(&todo).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete todo"})
		return
	}

	c.Status(http.StatusNoContent)
}
