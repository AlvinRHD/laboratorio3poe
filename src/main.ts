import { ExplorerTour } from './lib/tour';
import { CreatureController } from './controllers/CreatureController';

document.querySelector('#year')!.textContent = String(new Date().getFullYear());

// La visita guiada funciona independientemente de la base de datos.
new ExplorerTour().init();

new CreatureController().init().catch(error => {
  console.error('Error al iniciar BESTIARIO:', error);

  const grid = document.querySelector<HTMLElement>('#creature-grid');
  if (grid) {
    grid.innerHTML = `
      <div class="empty-state">
        <h3>No se pudo abrir el archivo.</h3>
        <p>Comprueba que el navegador permita almacenamiento local y vuelve a cargar.</p>
      </div>
    `;
  }
});
