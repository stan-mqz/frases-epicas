# 🎮 Arcade de Frases Épicas

Un "arcade" donde cualquiera puede agregar frases memorables de videojuegos, películas, series, memes y anime, votarlas y ver cómo suben en un **Top 10** en tiempo real.

**Demo en Vercel:** _(pega aquí tu URL pública)_

## Qué se puede hacer

- **Crear** frases con su fuente y categoría.
- **Leer** el Top 10 y la lista completa, con búsqueda y filtro por categoría.
- **Editar** el texto, la fuente o la categoría de una frase.
- **Eliminar** frases.
- **Votar** a favor (▲) o quitar un voto (▼); el ranking se actualiza al instante.
- Los datos **persisten** al recargar la página.

## Tecnologías

- [Vite](https://vitejs.dev/) + TypeScript
- [sql.js](https://sql.js.org/) (SQLite compilado a WebAssembly, corre en el navegador)
- `localStorage` para guardar la base de datos entre sesiones
- Arquitectura MVC (`models`, `views`, `controllers`)
- Despliegue en Vercel

## Base de datos

Tabla `frases`:

| Campo | Tipo | Descripción |
|---|---|---|
| id | INTEGER PK | Identificador autoincremental |
| texto | TEXT | La frase |
| fuente | TEXT | Juego, película, meme… |
| categoria | TEXT | Videojuegos, Películas, Series, Memes, Anime |
| votos | INTEGER | Votos acumulados (mínimo 0) |
| creada_en | TEXT | Fecha de creación |

Al primer arranque se siembran 12 frases de ejemplo. El botón "Restaurar frases de ejemplo" vuelve a ese estado.

## Cómo ejecutarlo

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # genera /dist
npm run preview
```

## Estructura

```
src/
├── main.ts
├── db/database.ts            # sql.js + persistencia en localStorage
├── models/frase.ts           # CRUD y votos (SQL)
├── views/arcadeView.ts       # HTML de la interfaz
├── controllers/arcadeController.ts
└── styles/styles.css
```

> Nota: la base de datos vive en el navegador de cada visitante (localStorage), por lo que el ranking es personal por dispositivo.
