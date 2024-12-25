from django.db import models

class Todo(models.Model):
    # Opciones para las prioridades
    PRIORITY_CHOICES = [
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
    ]

    title = models.CharField(max_length=200)  # Título de la tarea
    description = models.TextField(blank=True, null=True)  # Descripción de la tarea
    completed = models.BooleanField(default=False)  # Estado de completado
    category = models.CharField(max_length=100, default="General")  # Categoría de la tarea
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='Medium')  # Prioridad
    due_date = models.DateField(null=True, blank=True)  # Fecha límite de la tarea
    subtasks = models.JSONField(default=list)  # Subtareas, almacenadas como una lista de diccionarios

    def __str__(self):
        return self.title
