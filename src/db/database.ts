import initSqlJs, { Database } from 'sql.js';
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url';

const STORAGE_KEY = 'arcade-frases-epicas-db-v1';
let db: Database;

const SEMILLA: [string, string, string, number][] = [
  ['It’s dangerous to go alone! Take this.', 'The Legend of Zelda', 'Videojuegos', 42],
  ['The cake is a lie.', 'Portal', 'Videojuegos', 37],
  ['War. War never changes.', 'Fallout', 'Videojuegos', 29],
  ['Do a barrel roll!', 'Star Fox 64', 'Videojuegos', 25],
  ['I’ll be back.', 'Terminator', 'Películas', 31],
  ['Hasta la vista, baby.', 'Terminator 2', 'Películas', 18],
  ['Que la fuerza te acompañe.', 'Star Wars', 'Películas', 34],
  ['Yo soy tu padre.', 'Star Wars', 'Películas', 27],
  ['Esto está bien.', 'Meme del perro en llamas', 'Memes', 22],
  ['Stonks.', 'Meme financiero', 'Memes', 12],
  ['Plata o plomo.', 'Narcos', 'Series', 15],
  ['Soy el que llama a la puerta.', 'Breaking Bad', 'Series', 20],
];

function aBase64(datos: Uint8Array): string {
  let s = '';
  const paso = 0x8000;
  for (let i = 0; i < datos.length; i += paso) {
    s += String.fromCharCode(...datos.subarray(i, i + paso));
  }
  return btoa(s);
}

function deBase64(b64: string): Uint8Array {
  const s = atob(b64);
  const datos = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) datos[i] = s.charCodeAt(i);
  return datos;
}

function crearTabla(): void {
  db.run(`CREATE TABLE IF NOT EXISTS frases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    texto TEXT NOT NULL,
    fuente TEXT NOT NULL,
    categoria TEXT NOT NULL,
    votos INTEGER NOT NULL DEFAULT 0,
    creada_en TEXT NOT NULL DEFAULT (datetime('now'))
  )`);
}

function sembrar(): void {
  const stmt = db.prepare('INSERT INTO frases (texto, fuente, categoria, votos) VALUES (?, ?, ?, ?)');
  for (const fila of SEMILLA) stmt.run(fila);
  stmt.free();
}

export async function abrirDb(): Promise<Database> {
  const SQL = await initSqlJs({ locateFile: () => wasmUrl });
  const guardada = localStorage.getItem(STORAGE_KEY);
  if (guardada) {
    try {
      db = new SQL.Database(deBase64(guardada));
      crearTabla();
      return db;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
  db = new SQL.Database();
  crearTabla();
  sembrar();
  guardar();
  return db;
}

export function getDb(): Database {
  return db;
}

export function guardar(): void {
  try {
    localStorage.setItem(STORAGE_KEY, aBase64(db.export()));
  } catch (e) {
    console.warn('No se pudo guardar en localStorage', e);
  }
}

export function reiniciar(): void {
  db.run('DROP TABLE IF EXISTS frases');
  crearTabla();
  sembrar();
  guardar();
}
