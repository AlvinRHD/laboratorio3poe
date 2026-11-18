# BESTIARIO — Archivo de criaturas imaginarias

Laboratorio #3 · Desarrollo web · UNIVO · Noviembre 2026

Una pequeña colección de criaturas que no existen. Se pueden inventar nuevas especies, cambiar su apariencia y conservar sus fichas como en un cuaderno de campo. El dibujo de cada criatura cambia según su familia, color y temperamento.

## Tecnologías

- **Vite + TypeScript** para el desarrollo.
- **HTML + CSS + SVG** para la interfaz y las ilustraciones originales.
- **SQL.js + SQLite (WebAssembly)** como base de datos dentro del navegador.
- **localStorage** para guardar una copia de SQLite entre sesiones.
- **GitHub + Vercel** para el repositorio y despliegue.

## Funciones

- Registrar criaturas con nombre, familia, hábitat, temperamento, color, rasgo y notas.
- Explorar una colección de fichas ilustradas.
- Buscar por nombre, hábitat o rasgo y filtrar por familia.
- Editar y eliminar registros con confirmación.
- Mantener las criaturas al recargar la página.
- Tres criaturas de ejemplo que aparecen solo la **primera vez** que se abre la aplicación.

## Ejecutar en VS Code

Requiere Node.js **20.19+ o 22.12+** y npm.

```bash
npm install
npm run dev
```

Abre la dirección que aparece en la terminal (habitualmente `http://localhost:5173`). No abras `index.html` con doble clic: este proyecto usa Vite.

Para comprobar que está listo para producción:

```bash
npm run build
npm run preview
```

Vite genera el sitio compilado dentro de `dist/`.

## Organización

```text
bestiario/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .gitignore
├── README.md
├── public/favicon.ico
└── src/
    ├── main.ts
    ├── db/database.ts
    ├── models/Creature.ts
    ├── models/CreatureModel.ts
    ├── views/CreatureView.ts
    ├── controllers/CreatureController.ts
    ├── lib/creatureArt.ts
    ├── lib/helpers.ts
    ├── types/assets.d.ts
    └── styles/styles.css
```

## Cómo se guardan los datos

SQLite se ejecuta con SQL.js en el navegador. Al guardar un cambio, se exporta la base SQLite y se conserva en `localStorage` bajo `bestiario.sqlite.v1`. El archivo WebAssembly se integra en la compilación de Vite mediante `?url`: no es necesario descargarlo desde otra web mientras se usa la aplicación.

**Importante:** el archivo es personal para cada navegador y dispositivo. Los datos **no se comparten entre visitantes** de la URL pública. Borrar los datos del sitio también elimina la colección local. Para una base compartida se necesitaría un servicio externo como Turso, pero el laboratorio permite expresamente SQLite en navegador.

## GitHub y Vercel

Crea un repositorio **público** y realiza al menos **tres commits significativos** a medida que trabajes, por ejemplo:

1. `Estructura inicial del proyecto con Vite y TypeScript`
2. `Agrego SQLite y operaciones CRUD de criaturas`
3. `Termino interfaz y adapto diseño para móviles`

En Vercel, importa el repositorio de GitHub. Configuración habitual:

- Framework: **Vite** (detección automática).
- Build Command: `npm run build`.
- Output Directory: `dist`.

Verifica en la URL publicada: crear, recargar, editar y eliminar; comprueba también el resultado desde un teléfono y la consola del navegador.

## Autor

Alvin Rosales · Ingeniería en Desarrollo de Software


## Diseño (segunda versión)

La navegación se integra en una portada de fantasía. La colección usa fichas ilustradas, colores suaves y un editor con vista previa. No se modificaron las operaciones SQLite ni la estructura MVC.
