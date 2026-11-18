import { DatabaseService } from '../db/database';
import { CreatureModel } from '../models/CreatureModel';
import type { CreatureInput } from '../models/Creature';
import { CreatureView } from '../views/CreatureView';

export class CreatureController {
  private view = new CreatureView();
  private deleteId: number | null = null;

  async init(): Promise<void> {
    await DatabaseService.init();

    this.view.bindNew(() => this.view.openEditor());
    this.view.bindActions(
      id => this.edit(id),
      id => this.askDelete(id)
    );
    this.view.bindSubmit((data, id) => this.save(data, id));
    this.view.bindFilter(() => this.refresh());
    this.view.bindDeletion(() => this.confirmDelete());
    this.refresh();
  }

  private refresh(): void {
    this.view.render(CreatureModel.all());
  }

  private save(data: CreatureInput, id: number | null): void {
    try {
      if (id === null) {
        CreatureModel.create(data);
      } else {
        CreatureModel.update(id, data);
      }

      this.view.closeEditor();
      this.refresh();
      this.view.showToast(id === null ? 'Especie registrada en el archivo.' : 'Ficha actualizada.');
    } catch (error) {
      console.error('No se pudo guardar la criatura:', error);
      this.view.setFormError('No se pudo guardar. Revisa el almacenamiento de tu navegador.');
    }
  }

  private edit(id: number): void {
    const creature = CreatureModel.find(id);
    if (creature) this.view.openEditor(creature);
  }

  private askDelete(id: number): void {
    const creature = CreatureModel.find(id);
    if (!creature) return;

    this.deleteId = id;
    this.view.askDelete(creature);
  }

  private confirmDelete(): void {
    if (this.deleteId === null) return;

    try {
      CreatureModel.delete(this.deleteId);
      this.deleteId = null;
      this.view.closeDelete();
      this.refresh();
      this.view.showToast('Especie retirada del archivo.');
    } catch (error) {
      console.error('No se pudo eliminar la criatura:', error);
      this.view.closeDelete();
      this.view.showToast('No se pudo eliminar la especie.');
    }
  }
}
