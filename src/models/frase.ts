import { getDb, guardar } from '../db/database';

export const CATEGORIAS = ['Videojuegos', 'Películas', 'Series', 'Memes', 'Anime'] as const;

export interface Frase {
  id: number;
  texto: string;
  fuente: string;
  categoria: string;
  votos: number;
  creada_en: string;
}

function consultar(sql: string, params: (string | number)[] = []): Frase[] {
  const stmt = getDb().prepare(sql);
  stmt.bind(params);
  const filas: Frase[] = [];
  while (stmt.step()) filas.push(stmt.getAsObject() as unknown as Frase);
  stmt.free();
  return filas;
}

export function listar(categoria = '', busqueda = ''): Frase[] {
  const q = `%${busqueda.trim()}%`;
  return consultar(
    `SELECT * FROM frases
     WHERE (? = '' OR categoria = ?) AND (texto LIKE ? OR fuente LIKE ?)
     ORDER BY votos DESC, id DESC`,
    [categoria, categoria, q, q],
  );
}

export function top(n = 10): Frase[] {
  return consultar('SELECT * FROM frases ORDER BY votos DESC, id ASC LIMIT ?', [n]);
}

export function obtener(id: number): Frase | undefined {
  return consultar('SELECT * FROM frases WHERE id = ?', [id])[0];
}

export function crear(texto: string, fuente: string, categoria: string): void {
  getDb().run('INSERT INTO frases (texto, fuente, categoria) VALUES (?, ?, ?)', [texto, fuente, categoria]);
  guardar();
}

export function actualizar(id: number, texto: string, fuente: string, categoria: string): void {
  getDb().run('UPDATE frases SET texto = ?, fuente = ?, categoria = ? WHERE id = ?', [texto, fuente, categoria, id]);
  guardar();
}

export function eliminar(id: number): void {
  getDb().run('DELETE FROM frases WHERE id = ?', [id]);
  guardar();
}

export function votar(id: number, delta: 1 | -1): void {
  getDb().run('UPDATE frases SET votos = MAX(0, votos + ?) WHERE id = ?', [delta, id]);
  guardar();
}
