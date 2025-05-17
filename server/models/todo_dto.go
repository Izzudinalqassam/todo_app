package models
import "time"

type CreateTodoRequest struct {
	Title   string `json:"title" binding:"required"`
	DueDate string `json:"due_date"`
}

type UpdateTodoRequest struct {
	Title     *string `json:"title,omitempty"`
	Completed *bool   `json:"completed,omitempty"`
	DueDate   *string `json:"due_date,omitempty"`
}

type TodoResponse struct {
	ID        uint      `json:"id"`
	Title     string    `json:"title"`
	Completed bool      `json:"completed"`
	DueDate   time.Time `json:"due_date"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
