import './styles/styles.css';
import { abrirDb } from './db/database';
import { iniciar } from './controllers/arcadeController';

const root = document.getElementById('app')!;

abrirDb()
  .then(() => iniciar(root))
  .catch((err) => {
    console.error(err);
    root.innerHTML = '<p class="error">No se pudo iniciar la base de datos. Recarga la página.</p>';
  });
