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
        todos = list(Todo.objects.values())  # Devuelve todos los objetos
        return JsonResponse(todos, safe=False)

    elif request.method == "POST":
        data = json.loads(request.body)
        todo = Todo.objects.create(
            title=data["title"], description=data["description"], completed=False
        )
        return JsonResponse({
            "id": todo.id,
            "title": todo.title,
            "description": todo.description,
            "completed": todo.completed,
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
        todo.save()
        return JsonResponse({
            "id": todo.id,
            "title": todo.title,
            "description": todo.description,
            "completed": todo.completed,
        })

    elif request.method == "DELETE":
        todo.delete()
        return JsonResponse({"message": "Todo deleted"}, status=204)

    return JsonResponse({"error": "Method not allowed"}, status=405)
