import { useEffect, useState } from "react";

const Todos = () => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newTask, setNewTask] = useState({ title: "", description: "", priority: "Medium", category: "", due_date: "" });

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        fetch(`${API_URL}/todos/`)
            .then((response) => response.json())
            .then((data) => {
                setTodos(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching data:", err);
                setLoading(false);
            });
    }, [API_URL]);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`${API_URL}/todos/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newTask),
        })
            .then((response) => response.json())
            .then((data) => {
                setTodos((prevTodos) => [...prevTodos, data]);
                setNewTask({ title: "", description: "", priority: "Medium", category: "", due_date: "" });
            })
            .catch((err) => console.error("Error creating task:", err));
    };

    const handleComplete = (id) => {
        fetch(`${API_URL}/todos/${id}/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ completed: true }),
        })
            .then((response) => response.json())
            .then((updatedTodo) => {
                setTodos((prevTodos) =>
                    prevTodos.map((todo) =>
                        todo.id === id ? updatedTodo : todo
                    )
                );
            })
            .catch((err) => console.error("Error updating task:", err));
    };

    const handleDelete = (id) => {
        fetch(`${API_URL}/todos/${id}/`, {
            method: "DELETE",
        })
            .then(() => {
                setTodos((prevTodos) =>
                    prevTodos.filter((todo) => todo.id !== id)
                );
            })
            .catch((err) => console.error("Error deleting task:", err));
    };

    if (loading) {
        return <p className="text-center text-lg font-medium mt-10">Loading...</p>;
    }

    return (
        <div className="max-w-4xl mx-auto p-5">
            <h1 className="text-3xl font-bold text-center mb-5">Todo List</h1>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-5">
                <input
                    type="text"
                    placeholder="Task Title"
                    value={newTask.title}
                    onChange={(e) =>
                        setNewTask({ ...newTask, title: e.target.value })
                    }
                    required
                    className="border p-2 rounded shadow"
                />
                <textarea
                    placeholder="Task Description"
                    value={newTask.description}
                    onChange={(e) =>
                        setNewTask({ ...newTask, description: e.target.value })
                    }
                    required
                    className="border p-2 rounded shadow"
                />
                <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="border p-2 rounded shadow"
                >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                </select>
                <input
                    type="text"
                    placeholder="Task Category"
                    value={newTask.category}
                    onChange={(e) =>
                        setNewTask({ ...newTask, category: e.target.value })
                    }
                    required
                    className="border p-2 rounded shadow"
                />
                <input
                    type="date"
                    value={newTask.due_date}
                    onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                    className="border p-2 rounded shadow"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                >
                    Add Task
                </button>
            </form>

            {/* Lista de tareas */}
            {todos.length === 0 ? (
                <p className="text-center text-lg text-gray-500">No tasks found.</p>
            ) : (
                <ul className="space-y-3">
                    {todos.map((todo) => (
                        <li
                            key={todo.id}
                            className={`p-4 rounded shadow ${
                                todo.completed
                                    ? "bg-green-100 border-green-500"
                                    : "bg-red-100 border-red-500"
                            } border`}
                        >
                            <strong className="text-lg">{todo.title}</strong>
                            <p>{todo.description}</p>
                            <p>Category: {todo.category}</p>
                            <p>Priority: {todo.priority}</p>
                            <p>Due Date: {todo.due_date || "No deadline"}</p>
                            <p>
                                Status:{" "}
                                <span
                                    className={`font-bold ${
                                        todo.completed ? "text-green-600" : "text-red-600"
                                    }`}
                                >
                                    {todo.completed ? "Completed" : "Pending"}
                                </span>
                            </p>
                            <div className="flex gap-2 mt-2">
                                {!todo.completed && (
                                    <button
                                        onClick={() => handleComplete(todo.id)}
                                        className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600"
                                    >
                                        Mark as Completed
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(todo.id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Todos;
