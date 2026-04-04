# dai-Gen

Aplicación web (Next.js + Tailwind) para capturar datos de incidentes, extraer información desde PDF y generar/modificar planillas Excel. Esta repo contiene una UI basada en React (carpeta `src/app`) y rutas API para procesamiento de datos.

---

## Características principales

- Formulario modular para ingresar datos del incidente (secciones en `src/app/form/sections`).
- Componentes reutilizables de inputs (`src/app/inputs`).
- Extracción de datos desde PDFs (vía `src/app/components/pdfDataExtractor` y la ruta API `src/app/api/extraer-datos/route.js`).
- Generación / modificación de planilla Excel mediante la ruta API `src/app/api/modificar-excel/route.js`.
- Estilos con Tailwind CSS y configuración compatible con Next.js.

---

## Requisitos

- Node.js >= 16
- npm o pnpm

---

## Instalación

Desde la raíz del proyecto:

```bash
npm install
# o
# pnpm install
```

---

## Comandos útiles

- Desarrollo (hot-reload):

```bash
npm run dev
```

- Construir para producción:

```bash
npm run build
npm run start
```

- Linter (si está configurado):

```bash
npm run lint
```

---

## Estructura importante

- `src/app/` — Entradas de la app (Next.js App Router).
  - `page.jsx` — Página principal.
  - `layout.jsx` — Diseño global.
  - `providers.jsx` — Proveedores globales (contextos, Theme, Toast, etc.).
  - `api/` — Endpoints del servidor:
    - `extraer-datos/route.js` — Endpoint para procesar y extraer datos de PDF.
    - `modificar-excel/route.js` — Endpoint para generar/modificar la planilla Excel.
- `src/app/components/` — Componentes reutilizables (form, modal, map, loader, pdfDataExtractor, Toast, etc.).
- `src/app/form/` — Formulario principal y secciones: cada sección es un componente independiente.
- `src/utils/` — Utilidades (validaciones, handlers, datos estáticos como `operators`, `jurisdictions`, etc.).
- `public/` — Recursos estáticos (imágenes, `workers/pdf.worker.min.js`, plantillas de Excel, etc.).

---

## Cómo usar la app

1. Levantar la aplicación con `npm run dev`.
2. Abrir `http://localhost:3000` en el navegador.
3. Rellenar el formulario con los datos del incidente.
4. Para extraer datos desde un PDF, usa el componente "Extractor PDF" en la UI o llama a la API `POST /api/extraer-datos` con el archivo PDF (multipart/form-data).
5. Para generar o modificar la planilla Excel, el frontend llama a `POST /api/modificar-excel` con los datos del formulario. La ruta devuelve el archivo listo para descargar.

Ejemplo de llamada desde el cliente para extraer datos (fetch):

```js
// En el navegador (ejemplo simplificado)
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const res = await fetch('/api/extraer-datos', {
  method: 'POST',
  body: formData,
});

const json = await res.json();
console.log('Datos extraídos:', json);
```

Ejemplo para solicitar la planilla modificada:

```js
const res = await fetch('/api/modificar-excel', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ datosFormulario }),
});

// Si devuelve archivo blob
const blob = await res.blob();
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'planilla.xlsx';
document.body.appendChild(a);
a.click();
```

---

## Personalización y desarrollo

- Añadir nuevas secciones del formulario: crea un archivo en `src/app/form/sections/` y exporta el componente.
- Nuevos inputs: seguir la estructura en `src/app/inputs/`.
- Si necesitas agregar assets (plantillas Excel, imágenes, worker JS), colocarlos en `public/`.

---

## Depuración

- Revisar la consola del servidor (terminal) para errores de las rutas API.
- Usar las herramientas de desarrollo del navegador para inspeccionar peticiones fetch y respuestas.

---

## Licencia

Este proyecto incluye un archivo `LICENSE` en la raíz. Revisa ese archivo para detalles legales.

---

Si necesitas que el README incluya secciones adicionales (diagramas, explicación de tests, o screenshots), puedo agregarlas.
