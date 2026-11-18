import * as Frases from '../models/frase';
import { reiniciar } from '../db/database';
import { montar, pintarTop, pintarLista, cargarForm, avisar } from '../views/arcadeView';

export function iniciar(root: HTMLElement): void {
  montar(root);

  const form = document.getElementById('form') as HTMLFormElement;
  const busqueda = document.getElementById('busqueda') as HTMLInputElement;
  const filtro = document.getElementById('filtro') as HTMLSelectElement;

  const refrescar = (): void => {
    pintarTop(Frases.top(10));
    pintarLista(Frases.listar(filtro.value, busqueda.value));
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const datos = new FormData(form);
    const id = Number(datos.get('id'));
    const texto = String(datos.get('texto')).trim();
    const fuente = String(datos.get('fuente')).trim();
    const categoria = String(datos.get('categoria'));
    if (!texto || !fuente) {
      avisar('Completa la frase y su fuente.');
      return;
    }
    if (id) {
      Frases.actualizar(id, texto, fuente, categoria);
      avisar('Cambios guardados');
    } else {
      Frases.crear(texto, fuente, categoria);
      avisar('Frase insertada');
    }
    cargarForm(null);
    refrescar();
  });

  busqueda.addEventListener('input', refrescar);
  filtro.addEventListener('change', refrescar);

  root.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-action]');
    if (!btn) return;
    const id = Number(btn.dataset.id);
    switch (btn.dataset.action) {
      case 'votar':
        Frases.votar(id, Number(btn.dataset.delta) as 1 | -1);
        refrescar();
        break;
      case 'editar':
        cargarForm(Frases.obtener(id) ?? null);
        break;
      case 'cancelar':
        cargarForm(null);
        break;
      case 'eliminar':
        if (confirm('¿Eliminar esta frase del arcade?')) {
          Frases.eliminar(id);
          avisar('Frase eliminada');
          refrescar();
        }
        break;
      case 'reiniciar':
        if (confirm('Esto reemplaza todas las frases por las de ejemplo. ¿Continuar?')) {
          reiniciar();
          cargarForm(null);
          avisar('Frases de ejemplo restauradas');
          refrescar();
        }
        break;
    }
  });

  refrescar();
}
