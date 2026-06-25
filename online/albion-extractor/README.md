# Albion Radar Overlay

Este proyecto proporciona un overlay de radar interactivo, transparente y de primer plano (always-on-top) utilizando Python y Tkinter. Está diseñado para escuchar actualizaciones de coordenadas a través de una conexión local por UDP y dibujarlas en tiempo real en la pantalla.

## Características

- **Ventana Transparente y Sin Bordes:** Se sitúa en la esquina superior izquierda de la pantalla por defecto, permitiendo ver el juego de fondo.
- **Always-On-Top:** Siempre visible por encima de la ventana del juego.
- **Arrastrable:** Puedes hacer clic izquierdo en los bordes del radar y arrastrarlo para colocarlo en cualquier posición de la pantalla.
- **Servidor UDP Ligero integrado:** Escucha en segundo plano actualizaciones JSON por el puerto UDP `5555`.
- **Efecto de Barrido Animado:** Una línea de barrido rotativa para emular un radar real.
- **Punto central (Jugador Local):** El círculo blanco central representa la ubicación del jugador local.
- **Distinción de Colores para Entidades:**
  - 🟥 **Rojo:** Enemigos (`enemy`)
  - 🟦 **Azul:** Aliados (`ally`)
  - cyan **Cian:** Recursos (`resource`)
  - 🟨 **Amarillo:** Desconocidos u otros tipos
- **Expiración de Entidades:** Los puntos que dejen de enviar datos desaparecerán del radar después de 3 segundos para evitar marcas fantasma.

---

## Requisitos Previos

Necesitas tener instalado **Python 3.x**. Tkinter viene preinstalado por defecto en la mayoría de las distribuciones estándar de Python en Windows.

---

## Cómo Ejecutar

### 1. Iniciar el Radar Overlay
Ejecuta el script principal del radar:
```bash
python overlay_radar.py
```
*Nota: Para cerrar el radar, selecciona la ventana del radar y presiona la tecla `ESC`.*

### 2. Enviar Datos de Prueba (Simulador)
Para comprobar que funciona correctamente, ejecuta el script de prueba que simulará movimientos de entidades (un enemigo dando vueltas, un recurso oscilando y un aliado estático):
```bash
python test_sender.py
```

---

## Formato de Datos UDP

El servidor UDP escucha por defecto en la dirección `127.0.0.1` y puerto `5555`. Para enviar datos al radar, debes enviar datagramas UDP con un payload JSON con la siguiente estructura:

```json
{
  "entities": [
    {
      "id": 101,
      "type": "enemy",
      "x": 25.5,
      "y": -12.3
    },
    {
      "id": 102,
      "type": "resource",
      "x": -15.0,
      "y": 8.4
    }
  ]
}
```

### Campos del JSON:
- `entities`: Array de entidades a dibujar.
- `id` (entero/string): Identificador único de la entidad para que el radar sepa si debe mover un punto existente o crear uno nuevo.
- `type` (string): Tipo de entidad (`enemy`, `resource`, `ally`, etc.) para determinar el color del punto.
- `x` y `y` (floats): Coordenadas relativas al jugador local (distancia en metros o unidades de juego).
  - Un valor de `x > 0` colocará el punto a la derecha del centro.
  - Un valor de `y > 0` colocará el punto arriba del centro.
