from django.shortcuts import render
from django.views.generic import TemplateView

def inicio(request):
    return render(request, 'base/principal.html')

from django.shortcuts import render

def registro(request):
    return render(request, 'base/register.html')

def login(request):
    return render(request, 'base/login.html')

class Restaurante(TemplateView):
    template_name="base/reserva.html"

class Pedido(TemplateView):
    template_name="base/PAGINA_3.html"