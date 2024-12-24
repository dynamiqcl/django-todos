import { useEffect, useState } from "react";

const Todos = () => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newTask, setNewTask] = useState({ title: "", description: "" });

    useEffect(() => {
        fetch("https://django-todos-production.up.railway.app/todos/")
            .then((response) => response.json())
            .then((data) => {
                setTodos(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("https://django-todos-production.up.railway.app/todos/", {
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

    if (loading) {
        return <p className="text-center text-lg font-medium mt-10">Loading...</p>;
    }

    return (
        <div className="max-w-4xl mx-auto p-5">
            <h1 className="text-3xl font-bold text-center mb-5">Todo List</h1>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="flex gap-2 mb-5">
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
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Todos;
