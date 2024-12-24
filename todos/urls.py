from django.urls import path
from . import views

urlpatterns = [
    path('', views.todo_list, name='todo-list'),  # Listar y crear tareas
    path('<int:id>/', views.todo_detail, name='todo-detail'),  # Actualizar y eliminar tareas
]
