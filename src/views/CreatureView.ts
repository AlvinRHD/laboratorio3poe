import { COLORS, FAMILIES, TEMPERAMENTS } from '../models/Creature';
import type { Creature, CreatureInput } from '../models/Creature';
import { creatureArt } from '../lib/creatureArt';
import { escapeHtml, formatDate } from '../lib/helpers';

export class CreatureView {
  private grid = document.querySelector<HTMLElement>('#creature-grid')!;
  private form = document.querySelector<HTMLFormElement>('#creature-form')!;
  private editor = document.querySelector<HTMLDialogElement>('#editor-dialog')!;
  private deleteDialog = document.querySelector<HTMLDialogElement>('#delete-dialog')!;
  private search = document.querySelector<HTMLInputElement>('#search')!;
  private filter = document.querySelector<HTMLSelectElement>('#family-filter')!;
  private editingId: number | null = null;
  private toastTimer = 0;

  bindNew(handler: () => void): void {
    ['#new-creature', '#add-another'].forEach(selector => {
      document.querySelector(selector)?.addEventListener('click', handler);
    });
  }

  bindActions(onEdit: (id: number) => void, onDelete: (id: number) => void): void {
    this.grid.addEventListener('click', event => {
      const target = event.target as HTMLElement;
      const button = target.closest<HTMLButtonElement>('[data-action]');
      if (!button) return;

      const id = Number(button.dataset.id);
      if (button.dataset.action === 'edit') onEdit(id);
      if (button.dataset.action === 'delete') onDelete(id);
      if (button.dataset.action === 'new') this.openEditor();
    });
  }

  bindSubmit(handler: (data: CreatureInput, id: number | null) => void): void {
    this.form.addEventListener('submit', event => {
      event.preventDefault();

      if (!this.form.reportValidity()) return;
      const creature = this.readForm();

      if (!creature.name || !creature.habitat || !creature.trait) {
        this.setFormError('Completa los campos obligatorios.');
        return;
      }

      handler(creature, this.editingId);
    });

    this.form.addEventListener('input', () => this.updatePreview());
    this.form.addEventListener('change', () => this.updatePreview());

    ['#close-editor', '#cancel-editor'].forEach(selector => {
      document.querySelector(selector)?.addEventListener('click', () => this.editor.close());
    });
  }

  bindFilter(handler: () => void): void {
    this.search.addEventListener('input', handler);
    this.filter.addEventListener('change', handler);
  }

  bindDeletion(onConfirm: () => void): void {
    document.querySelector('#cancel-delete')?.addEventListener('click', () => {
      this.deleteDialog.close();
    });
    document.querySelector('#confirm-delete')?.addEventListener('click', onConfirm);
  }

  getSearch(): string {
    return this.search.value.trim().toLocaleLowerCase('es');
  }

  getFamily(): string {
    return this.filter.value;
  }

  openEditor(creature?: Creature): void {
    this.form.reset();
    this.editingId = creature?.id ?? null;
    this.setFormError('');

    const title = document.querySelector<HTMLElement>('#editor-title')!;
    const button = document.querySelector<HTMLButtonElement>('#save-creature')!;

    title.textContent = creature ? 'Editar criatura' : 'Crear criatura';
    button.textContent = creature ? 'Guardar cambios →' : 'Guardar criatura →';

    if (creature) {
      for (const field of ['name', 'family', 'habitat', 'temperament', 'trait', 'notes'] as const) {
        const input = this.form.elements.namedItem(field) as HTMLInputElement;
        input.value = creature[field];
      }

      const color = this.form.querySelector<HTMLInputElement>(`input[name="color"][value="${creature.color}"]`);
      if (color) color.checked = true;
    }

    this.updatePreview();
    this.editor.showModal();
    document.querySelector<HTMLInputElement>('#creature-name')?.focus();
  }

  closeEditor(): void {
    this.editor.close();
  }

  askDelete(creature: Creature): void {
    document.querySelector('#delete-description')!.textContent =
      `Vas a eliminar a ${creature.name} de tu colección. Esta acción no se puede deshacer.`;
    this.deleteDialog.showModal();
  }

  closeDelete(): void {
    this.deleteDialog.close();
  }

  setFormError(message: string): void {
    const element = document.querySelector<HTMLElement>('#form-error')!;
    element.hidden = !message;
    element.textContent = message;
  }

  showToast(message: string): void {
    const toast = document.querySelector<HTMLElement>('#toast')!;
    toast.textContent = message;
    toast.classList.add('visible');
    window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => toast.classList.remove('visible'), 3200);
  }

  render(all: Creature[]): void {
    const query = this.getSearch();
    const family = this.getFamily();
    const shown = all.filter(creature => {
      const matchesFamily = !family || creature.family === family;
      const haystack = `${creature.name} ${creature.habitat} ${creature.trait}`.toLocaleLowerCase('es');
      return matchesFamily && haystack.includes(query);
    });

    document.querySelector('#total-count')!.textContent = String(all.length).padStart(2, '0');
    document.querySelector('#result-count')!.textContent =
      `${shown.length} ${shown.length === 1 ? 'registro' : 'registros'}`;

    const featured = all[0];
    document.querySelector('#hero-index')!.textContent = featured
      ? `DESCUBRIMIENTO ${String(featured.id).padStart(3, '0')}`
      : 'AÚN SIN DESCUBRIMIENTOS';
    document.querySelector('#hero-name')!.textContent = featured?.name ?? 'Sin especímenes';
    document.querySelector('#hero-family')!.textContent = featured?.family.toUpperCase() ?? 'POR DESCUBRIR';
    document.querySelector('#hero-art')!.innerHTML = creatureArt(featured ?? {
      family: 'Nocturna', color: '#b8a5d6', temperament: 'Curiosa'
    }, 'featured');

    if (!shown.length) {
      this.grid.innerHTML = `
        <div class="empty-state">
          <span class="empty-symbol" aria-hidden="true">✳</span>
          <h3>${all.length ? 'No encontramos esa criatura.' : 'Tu mundo espera su primera criatura.'}</h3>
          <p>${all.length ? 'Prueba con otra búsqueda o familia.' : 'Abre una ficha y comienza a imaginar.'}</p>
          ${all.length ? '' : '<button class="button button-dark" data-action="new" type="button">Crear criatura →</button>'}
        </div>
      `;
      return;
    }

    this.grid.innerHTML = shown.map((creature, index) => this.card(creature, index)).join('');
  }

  private card(creature: Creature, index: number): string {
    const name = escapeHtml(creature.name);
    const family = escapeHtml(creature.family);
    const habitat = escapeHtml(creature.habitat);
    const trait = escapeHtml(creature.trait);
    const notes = escapeHtml(creature.notes);

    return `
      <article class="creature-card">
        <div class="card-illustration">
          <div class="card-topline"><span>CRIATURA ${String(index + 1).padStart(3, '0')}</span><span>✳</span></div>
          <div class="card-art" role="img" aria-label="Ilustración de ${name}">
            ${creatureArt(creature, `card-${creature.id}`)}
          </div>
          <div class="card-art-footer"><span>${family.toUpperCase()}</span><span>N.º ${String(creature.id).padStart(3, '0')}</span></div>
        </div>
        <div class="card-details">
          <div class="card-meta"><span>${habitat}</span><span>${escapeHtml(formatDate(creature.createdAt))}</span></div>
          <h3>${name}</h3>
          <p class="card-trait">${trait}</p>
          ${notes ? `<p class="card-notes">${notes}</p>` : ''}
          <div class="card-bottom">
            <span class="temperament">${escapeHtml(creature.temperament)}</span>
            <div class="card-actions">
              <button type="button" data-action="edit" data-id="${creature.id}" aria-label="Editar ${name}">Editar →</button>
              <button type="button" class="remove-action" data-action="delete" data-id="${creature.id}" aria-label="Eliminar ${name}">Eliminar</button>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  private readForm(): CreatureInput {
    const data = new FormData(this.form);
    const family = String(data.get('family'));
    const temperament = String(data.get('temperament'));
    const color = String(data.get('color'));

    return {
      name: String(data.get('name') ?? '').trim(),
      family: FAMILIES.find(value => value === family) ?? 'Nocturna',
      habitat: String(data.get('habitat') ?? '').trim(),
      temperament: TEMPERAMENTS.find(value => value === temperament) ?? 'Pacífica',
      color: COLORS.find(value => value.hex === color)?.hex ?? COLORS[0].hex,
      trait: String(data.get('trait') ?? '').trim(),
      notes: String(data.get('notes') ?? '').trim()
    };
  }

  private updatePreview(): void {
    const creature = this.readForm();
    document.querySelector('#preview-art')!.innerHTML = creatureArt(creature, 'live');
    document.querySelector('#preview-name')!.textContent = creature.name || 'Sin nombre';
    document.querySelector('#preview-description')!.textContent = `ESPECIE ${creature.family.toUpperCase()}`;
  }
}
