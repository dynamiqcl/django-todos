import { useEffect, useState } from "react";
import { FiCheckCircle, FiTrash2 } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        if (!newTask.title || !newTask.description) {
            toast.error("Please fill in all fields!");
            return;
        }
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
                toast.success("Task added successfully!");
            })
            .catch((error) => toast.error("Error creating task!"));
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
                toast.success("Task marked as completed!");
            })
            .catch((error) => toast.error("Error updating task!"));
    };

    const handleDelete = (id) => {
        fetch(`${API_URL}/todos/${id}/`, {
            method: "DELETE",
        })
            .then(() => {
                setTodos((prevTodos) =>
                    prevTodos.filter((todo) => todo.id !== id)
                );
                toast.success("Task deleted successfully!");
            })
            .catch((error) => toast.error("Error deleting task!"));
    };

    if (loading) {
        return <p className="text-center text-lg font-medium mt-10">Loading...</p>;
    }

    return (
        <div className="max-w-4xl mx-auto p-5">
            <ToastContainer />
            <h1 className="text-4xl font-bold text-center mb-8 text-gradient">
                Todo List
            </h1>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 mb-5">
                <input
                    type="text"
                    placeholder="Task Title"
                    value={newTask.title}
                    onChange={(e) =>
                        setNewTask({ ...newTask, title: e.target.value })
                    }
                    required
                    className="flex-1 border p-3 rounded shadow-md focus:outline-none focus:ring focus:ring-blue-300"
                />
                <input
                    type="text"
                    placeholder="Task Description"
                    value={newTask.description}
                    onChange={(e) =>
                        setNewTask({ ...newTask, description: e.target.value })
                    }
                    required
                    className="flex-1 border p-3 rounded shadow-md focus:outline-none focus:ring focus:ring-blue-300"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-6 py-3 rounded shadow hover:bg-blue-600 transition"
                >
                    Add Task
                </button>
            </form>

            {/* Lista de tareas */}
            {todos.length === 0 ? (
                <p className="text-center text-lg text-gray-500">No tasks found.</p>
            ) : (
                <ul className="space-y-4">
                    {todos.map((todo) => (
                        <li
                            key={todo.id}
                            className={`p-5 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-start md:items-center ${
                                todo.completed
                                    ? "bg-green-100 border-green-500"
                                    : "bg-red-100 border-red-500"
                            } border`}
                        >
                            <div>
                                <h2 className="text-2xl font-semibold">{todo.title}</h2>
                                <p className="text-gray-700">{todo.description}</p>
                                <p className="mt-2">
                                    Status:{" "}
                                    <span
                                        className={`font-bold ${
                                            todo.completed
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {todo.completed ? "Completed" : "Pending"}
                                    </span>
                                </p>
                            </div>
                            <div className="flex gap-4 mt-4 md:mt-0">
                                {!todo.completed && (
                                    <button
                                        onClick={() => handleComplete(todo.id)}
                                        className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 flex items-center gap-2"
                                    >
                                        <FiCheckCircle /> Complete
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(todo.id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 flex items-center gap-2"
                                >
                                    <FiTrash2 /> Delete
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
