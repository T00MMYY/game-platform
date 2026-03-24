# 🎮 Game Platform CRM

Bienvenido a **Game Platform CRM**, un sistema integral desarrollado para la gestión y distribución de videojuegos web. Esta plataforma permite a los administradores subir, catalogar y organizar juegos como un CRM, mientras proporciona a los jugadores un entorno unificado y fluido donde jugarlos.

---

## 🛠 Tecnologías Utilizadas y su Función

*   **Laravel 11 (PHP):** Framework principal del backend. Coordina todo el sistema, manejando el enrutamiento, la autenticación, los permisos mediante middlewares y la comunicación con la base de datos a través de Eloquent ORM.
*   **Inertia.js:** Tecnología que actúa como puente entre el backend (Laravel) y el frontend (React). Permite construir la aplicación como una *Single Page Application* (SPA) sin la complejidad de crear una API intermedia y usar rutas del lado del cliente.
*   **React:** Librería encargada de la capa de presentación (Frontend). Construye interfaces interactivas, como los formularios dinámicos, tablas de gestión y modales de forma declarativa.
*   **PostgreSQL:** Sistema gestor de bases de datos relacional. Elegido por su robustez, rendimiento en consultas relacionales complejas y seguridad en el manejo de datos de usuarios y juegos.
*   **Tailwind CSS:** Framework de diseño utilitario para aplicar estilos rápidamente a todos los componentes de la interfaz de la plataforma CRM.
*   **Vite:** Herramienta de compilación ultrarrápida (Bundler). Se encarga de transformar y empaquetar el código JSX/React, el CSS y en caso de que un juego se agregue directamente, compilar sus assets estáticos para que el navegador los entienda.

---

## 🏗 Implementación de la Arquitectura

### 1. Base de Datos
El diseño de la base de datos se ha desarrollado priorizando la escalabilidad e integridad referencial utilizando **Migraciones de Laravel** y **Eloquent ORM**.

*   **Tablas core:** `users`, `roles`, y `games`.
*   **Modelos y Relaciones:** Se implementan relaciones One-to-Many (`1:N`). 
    *   Un `User` pertenece a un `Role` (`belongsTo`).
    *   Un `User` puede crear varios `Games` (`hasMany`). 
    *   El modelo `Game` contiene la información vital del recurso CRM: `title`, `description`, `url` (origen del archivo del juego o enlace externo), `thumbnail` e `is_published`.
*   **PostgreSQL** es el motor central utilizado, configurado a través de variables de entorno estandarizadas (`.env`).

### 2. Autenticación y Control de Accesos (Roles)
La seguridad es estricta y controlada exclusivamente desde el servidor backend para evitar manipulaciones de lado del cliente.

*   **Sistema Base:** Se implementó Laravel Breeze/Sanctum como punto de entrada de sesión sólido, proveyendo registro, inicio y deslogueo.
*   **Roles y Middlewares:** Se crearon 3 perfiles jerárquicos: `Admins`, `Managers` y `Players`.
    *   Para separar privilegios, se ha creado un **Middleware** `CheckRole` en Laravel.
    *   Si un `Player` intenta escribir manualmente en el navegador la URL del panel de control de administrador (ej: `/games/create`), Laravel abortará la petición, devolviendo un error de acceso no autorizado, protegiendo todo el CRUD.

### 3. API y Separación de Rutas Estratégica
La arquitectura de enrutamiento asegura que la lógica de renderizado web y los servicios de datos programáticos no converjan, manteniendo un código limpio.

*   **Capa Web (`routes/web.php`):** Gestiona la interfaz humana del CRM. Coordina el menú lateral, la navegación autenticada y las vistas de catálogo, devolviendo estrictamente componentes `Inertia::render()`.
*   **Capa API (`routes/api.php`):** Diseñada para consumo *Stateless*. Devuelve la información de la base de datos puramente en formato **JSON**. Esto significa que los juegos producidos por terceros podrán hacer peticiones `fetch()` a la API del proyecto base (para descargar configuraciones, puntajes, etc.) utilizando una abstracción estándar REST.

### 4. Gestión de Juegos (CRUD Inverso)
El módulo principal del CRM es la gestión de recursos o videojuegos ("Games").
*   Los usuarios con rol de *Admin* o *Gestor* tienen a su disposición un panel completo (Create, Read, Update, Delete). 
*   **Separación del Código del Juego:** La plataforma no alberga en su código fuente base la lógica de programación del videojuego en sí (código C#, Blueprints, Vue en bruto, etc.). En su lugar, pide el empaquetado final o una **URL externa** (estática) que apunta a un servidor (o a la carpeta estática `public/dist/`).
*   Esto mantiene el core de Laravel inmaculable, delegando a los desarrolladores del juego la responsabilidad de proveer un WebGL, HTML5 o React/Vue ya encapsulado (Build).

### 5. Experiencia de Jugador y Flujo de Juego
La experiencia objetivo principal se ha concretado mediante una "Player View" dedicada, implementada a través de un controlador especializado (`Player/GameController`):

1.  **Catálogo Automatizado:** Los jugadores exploran un grid de juegos. A nivel backend, se filtra automáticamente usando la cláusula `where('is_published', true)`, garantizando que el usuario estándar nunca pueda previsualizar prototipos ocultos de los administradores.
2.  **Juego Embebido con iFrame:** Tras hacer click, ocurre la magia central del proyecto. Se inyecta la URL oficial del juego subido dentro de la etiqueta HTML5 `<iframe allowFullScreen />`. 
3.  **Resultados de Inmersión:** Este approach hace que el jugador no abandone el portal, manteniendo visibles los logotipos y menús de navegación de la plataforma oficial mientras disfruta del juego a resolución completa embebido en la pantalla principal.
