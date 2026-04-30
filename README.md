# 🎮 Game Platform CRM & AI Integration

Bienvenido a **Game Platform CRM**, un sistema integral para la gestión de videojuegos web potenciado con:
- ✅ **RabbitMQ** para arquitectura orientada a eventos
- ✅ **MCP (Model Context Protocol)** para integración con IA (GitHub + RabbitMQ)
- ✅ **Reconocimiento Facial Biométrico** con DeepFace
- ✅ **Chat en Tiempo Real** con Reverb/WebSockets

---

## 🛠️ Tecnologías Utilizadas

### Core del CRM
- **Laravel 11** (PHP): Framework principal del backend
- **Inertia.js & React**: SPA para gestión del catálogo y panel admin
- **SQLite/PostgreSQL**: Base de datos relacional
- **Tailwind CSS & Vite**: Diseño moderno y compilación rápida

### Infraestructura de Eventos e IA
- **RabbitMQ 3-management**: Broker de mensajería con panel de gestión en puerto 15672
- **Docker**: Orquestación de servicios
- **Microservicio Python**: DeepFace para reconocimiento facial
- **MCP Servers**: Integración con GitHub y RabbitMQ vía Claude Desktop

---

## 🚀 Inicio Rápido

### 1. Requisitos Previos

```bash
# Dependencias necesarias
- Docker & Docker Desktop
- PHP 8.2+
- Node.js 18+
- Composer
- Git
```

### 2. Instalación Base del Proyecto

```bash
# Clonar y configurar
git clone <tu-repo>
cd game-platform

# Instalar dependencias
composer install
npm install

# Generar clave de aplicación
php artisan key:generate

# Ejecutar migraciones
php artisan migrate
```

### 3. Levantar RabbitMQ con Docker

```bash
# Opción A: Comando directo
docker run -d \
  --name rabbitmq \
  -p 5672:5672 \
  -p 15672:15672 \
  rabbitmq:3-management

# Opción B: Si ya existe el contenedor
docker start rabbitmq

# Verificar: http://localhost:15672 (credenciales: guest/guest)
```

### 4. Configurar Variables de Entorno (`.env`)

```env
# Queue - IMPORTANTE: Cambiar de database a rabbitmq cuando esté listo
QUEUE_CONNECTION=database

# RabbitMQ (cuando estés listo para producción)
# QUEUE_CONNECTION=rabbitmq
# RABBITMQ_HOST=localhost
# RABBITMQ_PORT=5672
# RABBITMQ_USER=guest
# RABBITMQ_PASSWORD=guest
# RABBITMQ_VHOST=/

# Broadcast (para chat en tiempo real)
BROADCAST_CONNECTION=log

# GitHub (se configura después con MCP)
GITHUB_PERSONAL_ACCESS_TOKEN=tu_token_aqui
```

---

## 🔗 Configurar MCP (Model Context Protocol)

### Paso 1: Instalar MCP para GitHub

#### 1.1 Crear GitHub Personal Access Token

1. Ve a [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. Haz clic en "Generate new token (classic)"
3. Selecciona permisos: `repo`, `read:issues`, `write:issues`
4. Copia el token (ej: `ghp_xxxxxxxxxxxx`)

#### 1.2 Configurar MCP Server en Claude Desktop

Edita el archivo de configuración de Claude Desktop:

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "github": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "GITHUB_PERSONAL_ACCESS_TOKEN=ghp_xxxxxxxxxxxx",
        "-e",
        "GITHUB_TOOLSETS=repos,issues,pull_requests",
        "ghcr.io/github/github-mcp-server"
      ]
    }
  }
}
```

**Uso desde Claude Desktop**:
```
"Crea una issue para la cola de validaciones de juegos"
"Revisa la PR y dime si falta validación en las sesiones"
"Lista todos los issues abiertos del proyecto"
```

---

### Paso 2: Instalar MCP para RabbitMQ

#### 2.1 Configurar MCP Server en Claude Desktop

Actualiza el archivo `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "github": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "GITHUB_PERSONAL_ACCESS_TOKEN=ghp_xxxxxxxxxxxx",
        "-e",
        "GITHUB_TOOLSETS=repos,issues,pull_requests",
        "ghcr.io/github/github-mcp-server"
      ]
    },
    "rabbitmq": {
      "command": "uvx",
      "args": [
        "amq-mcp-server-rabbitmq@latest",
        "--url",
        "amqp://guest:guest@localhost:5672",
        "--allow-mutative-tools"
      ]
    }
  }
}
```

**Instalación previa** (si no tienes `uvx`):
```bash
pip install uv
```

**Uso desde Claude Desktop**:
```
"Lista todas las colas de RabbitMQ"
"Verifica si la cola eventos_github tiene mensajes pendientes"
"¿Cuántos mensajes hay en la cola validaciones_juego?"
```

---

## 📋 Sistema de Eventos con RabbitMQ

### Paso 1: Instalar la librería PHP de RabbitMQ

```bash
composer require php-amqplib/php-amqplib
```

### Paso 2: Crear Eventos en Laravel

#### Ejemplo: Evento cuando se publica un juego

```bash
php artisan make:event GamePublished
```

**`app/Events/GamePublished.php`**:
```php
<?php
namespace App\Events;

use App\Models\Game;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;

class GamePublished
{
    use Queueable, SerializesModels;

    public function __construct(public Game $game)
    {
    }
}
```

### Paso 3: Crear Jobs que Publiquen a RabbitMQ

```bash
php artisan make:job PublishGameToQueue
```

**`app/Jobs/PublishGameToQueue.php`**:
```php
<?php
namespace App\Jobs;

use App\Models\Game;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;

class PublishGameToQueue implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public Game $game)
    {
    }

    public function handle()
    {
        $message = [
            'event' => 'game.published',
            'game_id' => $this->game->id,
            'game_name' => $this->game->name,
            'timestamp' => now(),
        ];

        // Aquí enviamos a RabbitMQ o lo procesamos localmente
        \Log::info('Evento publicado', $message);
    }
}
```

### Paso 4: Activar Eventos cuando Ocurren Acciones

En el **Controlador** o **Modelo**:

```php
// En app/Http/Controllers/GameController.php o similar
use App\Events\GamePublished;
use App\Jobs\PublishGameToQueue;

public function publish(Game $game)
{
    $game->published_at = now();
    $game->save();

    // Disparar evento
    event(new GamePublished($game));
    
    // O enviar directamente a la cola
    PublishGameToQueue::dispatch($game);

    return response()->json(['message' => 'Juego publicado']);
}
```

### Paso 5: Consumir Eventos (Workers)

Crear un worker que escuche eventos:

```bash
php artisan make:command ConsumeGameEvents
```

**`app/Console/Commands/ConsumeGameEvents.php`**:
```php
<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;

class ConsumeGameEvents extends Command
{
    protected $signature = 'app:consume-game-events';
    protected $description = 'Consume game events from RabbitMQ';

    public function handle()
    {
        while (true) {
            // Lógica para consumir eventos
            $this->info('Escuchando eventos...');
            sleep(5);
        }
    }
}
```

Ejecutar:
```bash
php artisan app:consume-game-events
```

---

## 🏗️ Arquitectura General

```
GitHub (código)
    ↓
GitHub MCP ← Claude Desktop (supervisor IA)
    ↓
Laravel (aplicación)
    ↓
RabbitMQ (message broker)
    ↓
Workers (procesar eventos)
    ↓
RabbitMQ MCP ← Claude Desktop (inspeccionar colas)
```

---

## 📊 Monitoreo

### Panel de RabbitMQ
- **URL**: http://localhost:15672
- **Usuario**: guest
- **Contraseña**: guest

Ver:
- ✅ Colas creadas
- ✅ Mensajes en cola
- ✅ Conexiones activas
- ✅ Exchanges configurados

### Desde Claude Desktop
Con MCP conectado:
```
"¿Cuál es el estado actual de RabbitMQ?"
"Muéstrame los eventos que se publicaron en las últimas 24 horas"
"¿Hay algún job fallido en la cola?"
```

---

## 🔄 Flujo Completo de Ejemplo

### Escenario: Publicar un juego y procesar en RabbitMQ

1. **Usuario publica juego** en el panel admin
2. **Laravel publica evento** `GamePublished`
3. **Job se envía a RabbitMQ** (cola `game.events`)
4. **Worker consume el evento** y ejecuta tareas (validación, notificaciones, etc.)
5. **Claude Desktop puede inspeccionar** estado de la cola con MCP
6. **Si falla algo, Claude crea automáticamente una issue** en GitHub

---

## 📝 Notas Importantes

- ⚠️ RabbitMQ usa credenciales por defecto (guest/guest) - cambiar en producción
- ⚠️ El GitHub PAT debe guardarse de forma segura (usar `.env`)
- ⚠️ Verificar que Docker Desktop esté ejecutándose antes de usar RabbitMQ
- ℹ️ Los ejemplos mostrados son orientativos - adaptarlos según necesidades específicas

---

## 🤝 Flujo de Trabajo Recomendado

1. Levantar RabbitMQ con Docker
2. Configurar MCP en Claude Desktop (GitHub + RabbitMQ)
3. Crear eventos y jobs en Laravel
4. Testear flujo manualmente
5. Automatizar con Workers
6. Usar Claude Desktop para supervisar y crear issues

---

## 📖 Recursos Útiles

- [Laravel Queue Documentation](https://laravel.com/docs/queues)
- [RabbitMQ Official Docs](https://www.rabbitmq.com/documentation.html)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [GitHub MCP Server](https://github.com/github/mcp-server-github)