from django.urls import path
from .views import inicio,registro,login, Restaurante ,Pedido

urlpatterns = [
    path('', inicio, name='inicio'),
    path('registro/', registro, name='registro'),
    path('login/', login, name='login'),
    path('restaurante/', Restaurante.as_view(), name='restaurante'),
    path('realizarPedido/', Pedido.as_view(), name='pedir'),
]

