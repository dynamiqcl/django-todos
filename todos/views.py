from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Todo
import json

# Vista para la raíz del sitio
def home(request):
    return HttpResponse("Bienvenido a la API de Todo List")

@csrf_exempt
def todo_list(request):
    if request.method == "GET":
        todos = list(Todo.objects.values())
        return JsonResponse(todos, safe=False)

    elif request.method == "POST":
        data = json.loads(request.body)
        todo = Todo.objects.create(
            title=data["title"],
            description=data.get("description", ""),
            completed=False,
            category=data.get("category", "General"),
            priority=data.get("priority", "Medium"),
            due_date=data.get("due_date"),
            subtasks=json.dumps(data.get("subtasks", []))  # Guardar subtareas como JSON
        )
        return JsonResponse({
            "id": todo.id,
            "title": todo.title,
            "description": todo.description,
            "completed": todo.completed,
            "category": todo.category,
            "priority": todo.priority,
            "due_date": todo.due_date,
            "subtasks": json.loads(todo.subtasks),  # Devolver subtareas como lista
        })

@csrf_exempt
def todo_detail(request, id):
    try:
        todo = Todo.objects.get(id=id)
    except Todo.DoesNotExist:
        return JsonResponse({"error": "Todo not found"}, status=404)

    if request.method == "PUT":
        data = json.loads(request.body)
        todo.title = data.get("title", todo.title)
        todo.description = data.get("description", todo.description)
        todo.completed = data.get("completed", todo.completed)
        todo.category = data.get("category", todo.category)
        todo.priority = data.get("priority", todo.priority)
        todo.due_date = data.get("due_date", todo.due_date)
        todo.subtasks = json.dumps(data.get("subtasks", json.loads(todo.subtasks)))
        todo.save()
        return JsonResponse({
            "id": todo.id,
            "title": todo.title,
            "description": todo.description,
            "completed": todo.completed,
            "category": todo.category,
            "priority": todo.priority,
            "due_date": todo.due_date,
            "subtasks": json.loads(todo.subtasks),
        })

    elif request.method == "DELETE":
        todo.delete()
        return JsonResponse({"message": "Todo deleted"}, status=204)

    return JsonResponse({"error": "Method not allowed"}, status=405)
