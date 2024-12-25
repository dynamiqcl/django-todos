import { useEffect, useState } from "react";

const Todos = () => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newTask, setNewTask] = useState({ title: "", description: "" });

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        fetch(`${API_URL}/todos/`)
            .then((response) => response.json())
            .then((data) => {
                setTodos(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
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
                setNewTask({ title: "", description: "" });
            })
            .catch((error) => console.error("Error creating task:", error));
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
            .catch((error) => console.error("Error updating task:", error));
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
            .catch((error) => console.error("Error deleting task:", error));
    };

    if (loading) {
        return <p className="text-center text-lg font-medium mt-10">Loading...</p>;
    }

    return (
        <div className="max-w-full sm:max-w-4xl mx-auto p-5">
            <h1 className="text-2xl sm:text-3xl font-bold text-center mb-5">Todo List</h1>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 mb-5">
                <input
                    type="text"
                    placeholder="Task Title"
                    value={newTask.title}
                    onChange={(e) =>
                        setNewTask({ ...newTask, title: e.target.value })
                    }
                    required
                    className="flex-1 border p-2 rounded shadow"
                />
                <input
                    type="text"
                    placeholder="Task Description"
                    value={newTask.description}
                    onChange={(e) =>
                        setNewTask({ ...newTask, description: e.target.value })
                    }
                    required
                    className="flex-1 border p-2 rounded shadow"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 w-full sm:w-auto"
                >
                    Add Task
                </button>
            </form>

            {/* Lista de tareas */}
            {todos.length === 0 ? (
                <p className="text-center text-lg text-gray-500">No tasks found.</p>
            ) : (
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                            <div className="flex gap-2 flex-wrap mt-2">
                                {!todo.completed && (
                                    <button
                                        onClick={() => handleComplete(todo.id)}
                                        className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 w-full sm:w-auto"
                                    >
                                        Mark as Completed
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(todo.id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 w-full sm:w-auto"
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
