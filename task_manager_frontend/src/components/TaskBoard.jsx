import React, { useState, useEffect } from 'react';

// Define all possible statuses here:
const STATUSES = ["To do", "Started", "In progress", "Finished"];

const TaskBoard = () => {
  // All tasks from the backend
  const [tasks, setTasks] = useState([]);
  
  // Track new task form data
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "To do", // default
    dueDate: ""
  });

  // Keep track of which task is in edit mode
  // We'll store the entire task object while editing
  const [editingTask, setEditingTask] = useState(null);

  // Fetch tasks from the backend on component load
  useEffect(() => {
    fetchTasks();
  }, []);

  // Function to GET all tasks
  const fetchTasks = () => {
    fetch("http://localhost:8082/tasks")
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Error fetching tasks:", err));
  };

  // Handle input changes for newTask
  const handleNewTaskChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  // Create a new task (POST)
  const handleCreateTask = (e) => {
    e.preventDefault();

    if (!newTask.title.trim()) {
      return; // don't create empty tasks
    }

    fetch("http://localhost:8082/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    })
      .then(() => {
        // Clear the form
        setNewTask({ title: "", description: "", status: "To do", dueDate: "" });
        // Refresh the task list
        fetchTasks();
      })
      .catch((err) => console.error("Error creating task:", err));
  };

  // Enter edit mode for a specific task
  const handleEditClick = (task) => {
    // Make a copy of the task so we can edit it
    setEditingTask({ ...task });
  };

  // Update the editingTask state as user types
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingTask((prev) => ({ ...prev, [name]: value }));
  };

  // Save changes to an existing task (PUT)
  const handleUpdateTask = (taskId) => {
    fetch(`http://localhost:8082/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingTask),
    })
      .then(() => {
        setEditingTask(null);  // Exit edit mode
        fetchTasks();          // Refresh tasks
      })
      .catch((err) => console.error("Error updating task:", err));
  };

  // Delete a task (DELETE)
  const handleDeleteTask = (taskId) => {
    fetch(`http://localhost:8082/tasks/${taskId}`, {
      method: "DELETE",
    })
      .then(() => {
        setEditingTask(null);  // If we were editing this task, exit edit mode
        fetchTasks();
      })
      .catch((err) => console.error("Error deleting task:", err));
  };

  // Render tasks in columns based on their status
  return (
    <div style={{ padding: "1rem" }}>
      <h1>Task Manager</h1>

      {/* === New Task Form === */}
      <form onSubmit={handleCreateTask} style={{ marginBottom: "1rem" }}>
        <h2>Add New Task</h2>
        <div>
          <label>Title:</label>
          <input
            name="title"
            value={newTask.title}
            onChange={handleNewTaskChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={newTask.description}
            onChange={handleNewTaskChange}
          />
        </div>
        <div>
          <label>Status:</label>
          <select
            name="status"
            value={newTask.status}
            onChange={handleNewTaskChange}
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Due Date:</label>
          <input
            type="date"
            name="dueDate"
            value={newTask.dueDate}
            onChange={handleNewTaskChange}
          />
        </div>
        <button type="submit">Create Task</button>
      </form>

      {/* === Task Board === */}
      <div style={{ display: "flex", gap: "1rem" }}>
        {STATUSES.map((columnStatus) => (
          <div
            key={columnStatus}
            style={{
              flex: 1,
              backgroundColor: "#f0f0f0",
              padding: "0.5rem",
              borderRadius: "8px",
            }}
          >
            <h2>{columnStatus}</h2>
            {tasks
              .filter((task) => task.status === columnStatus)
              .map((task) => {
                // If this task is in edit mode
                if (editingTask && editingTask.id === task.id) {
                  return (
                    <div
                      key={task.id}
                      style={{
                        backgroundColor: "#fff",
                        padding: "0.5rem",
                        marginBottom: "0.5rem",
                        borderRadius: "4px",
                      }}
                    >
                      <input
                        name="title"
                        value={editingTask.title}
                        onChange={handleEditChange}
                      />
                      <textarea
                        name="description"
                        value={editingTask.description}
                        onChange={handleEditChange}
                        style={{ display: "block", marginTop: "0.5rem" }}
                      />
                      <select
                        name="status"
                        value={editingTask.status}
                        onChange={handleEditChange}
                        style={{ display: "block", marginTop: "0.5rem" }}
                      >
                        {STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <input
                        type="date"
                        name="dueDate"
                        value={editingTask.dueDate || ""}
                        onChange={handleEditChange}
                        style={{ display: "block", marginTop: "0.5rem" }}
                      />
                      <div style={{ marginTop: "0.5rem" }}>
                        <button
                          onClick={() => handleUpdateTask(task.id)}
                          style={{ marginRight: "0.5rem" }}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          style={{ backgroundColor: "red", color: "#fff" }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                }

                // Read-only view
                return (
                  <div
                    key={task.id}
                    style={{
                      backgroundColor: "#fff",
                      padding: "0.5rem",
                      marginBottom: "0.5rem",
                      borderRadius: "4px",
                    }}
                  >
                    <h4>{task.title}</h4>
                    <p>{task.description}</p>
                    <p>
                      <strong>Status:</strong> {task.status}
                    </p>
                    {task.dueDate && (
                      <p>
                        <strong>Due Date:</strong> {task.dueDate}
                      </p>
                    )}
                    <button onClick={() => handleEditClick(task)}>Edit</button>
                  </div>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskBoard;
