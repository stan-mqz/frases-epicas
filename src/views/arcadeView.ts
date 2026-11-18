import { CATEGORIAS, Frase } from '../models/frase';

const esc = (s: string): string =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const opciones = CATEGORIAS.map((c) => `<option value="${c}">${c}</option>`).join('');

export function montar(root: HTMLElement): void {
  root.innerHTML = `
    <header class="marquee">
      <h1>Arcade de Frases Épicas</h1>
      <p>Vota las frases que merecen un lugar en el salón de la fama.</p>
    </header>
    <main class="tablero">
      <section class="panel" aria-labelledby="t-top">
        <h2 id="t-top">Top 10</h2>
        <ol id="top" class="top"></ol>
      </section>

      <section class="panel" aria-labelledby="t-form">
        <h2 id="t-form">Insertar frase</h2>
        <form id="form" autocomplete="off">
          <input type="hidden" name="id" />
          <label>Frase
            <textarea name="texto" rows="3" maxlength="200" required placeholder="Escribe la frase tal como la recuerdas"></textarea>
          </label>
          <label>De dónde viene
            <input name="fuente" maxlength="60" required placeholder="Juego, película, meme…" />
          </label>
          <label>Categoría
            <select name="categoria">${opciones}</select>
          </label>
          <div class="fila">
            <button type="submit" class="btn btn-moneda" id="enviar">Insertar frase</button>
            <button type="button" class="btn btn-suave" id="cancelar" data-action="cancelar" hidden>Cancelar</button>
          </div>
        </form>
      </section>

      <section class="panel ancho" aria-labelledby="t-lista">
        <h2 id="t-lista">Todas las frases</h2>
        <div class="filtros">
          <input id="busqueda" type="search" placeholder="Buscar por frase o fuente" aria-label="Buscar frases" />
          <select id="filtro" aria-label="Filtrar por categoría">
            <option value="">Todas las categorías</option>${opciones}
          </select>
        </div>
        <p id="conteo" class="conteo" aria-live="polite"></p>
        <ul id="lista" class="lista"></ul>
      </section>
    </main>
    <div id="aviso" class="aviso" role="status" aria-live="polite"></div>`;
}

export function pintarTop(frases: Frase[]): void {
  const max = Math.max(1, ...frases.map((f) => f.votos));
  document.getElementById('top')!.innerHTML = frases
    .map(
      (f, i) => `
      <li class="puesto p${i + 1}">
        <span class="rango">${i + 1}</span>
        <div class="puesto-info">
          <q>${esc(f.texto)}</q>
          <small>${esc(f.fuente)}</small>
          <div class="barra" aria-hidden="true"><i style="width:${(f.votos / max) * 100}%"></i></div>
        </div>
        <span class="puntos" aria-label="${f.votos} votos">${f.votos}</span>
      </li>`,
    )
    .join('');
}

export function pintarLista(frases: Frase[]): void {
  document.getElementById('conteo')!.textContent = `${frases.length} ${frases.length === 1 ? 'frase' : 'frases'}`;
  document.getElementById('lista')!.innerHTML = frases.length
    ? frases
        .map(
          (f) => `
      <li class="frase">
        <div class="votos">
          <button class="voto" data-action="votar" data-id="${f.id}" data-delta="1" aria-label="Votar a favor">▲</button>
          <strong>${f.votos}</strong>
          <button class="voto" data-action="votar" data-id="${f.id}" data-delta="-1" aria-label="Quitar un voto">▼</button>
        </div>
        <div class="cuerpo">
          <blockquote>${esc(f.texto)}</blockquote>
          <p class="meta">${esc(f.fuente)} · <span class="etiqueta">${esc(f.categoria)}</span></p>
        </div>
        <div class="acciones">
          <button class="btn btn-suave" data-action="editar" data-id="${f.id}">Editar</button>
          <button class="btn btn-peligro" data-action="eliminar" data-id="${f.id}">Eliminar</button>
        </div>
      </li>`,
        )
        .join('')
    : '<li class="vacio">Ninguna frase coincide. Prueba otra búsqueda o inserta una nueva.</li>';
}

export function cargarForm(f: Frase | null): void {
  const form = document.getElementById('form') as HTMLFormElement;
  (form.elements.namedItem('id') as HTMLInputElement).value = f ? String(f.id) : '';
  (form.elements.namedItem('texto') as HTMLTextAreaElement).value = f?.texto ?? '';
  (form.elements.namedItem('fuente') as HTMLInputElement).value = f?.fuente ?? '';
  (form.elements.namedItem('categoria') as HTMLSelectElement).value = f?.categoria ?? 'Videojuegos';
  document.getElementById('t-form')!.textContent = f ? 'Editar frase' : 'Insertar frase';
  document.getElementById('enviar')!.textContent = f ? 'Guardar cambios' : 'Insertar frase';
  (document.getElementById('cancelar') as HTMLButtonElement).hidden = !f;
  if (f) form.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

let temporizador = 0;
export function avisar(mensaje: string): void {
  const el = document.getElementById('aviso')!;
  el.textContent = mensaje;
  el.classList.add('visible');
  clearTimeout(temporizador);
  temporizador = window.setTimeout(() => el.classList.remove('visible'), 2200);
}
