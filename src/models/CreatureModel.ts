import { DatabaseService } from '../db/database';
import type { Creature, CreatureInput } from './Creature';

export class CreatureModel {
  static all(): Creature[] {
    const statement = DatabaseService.get().prepare(`
      SELECT id, name, family, habitat, temperament, color,
             trait, notes, created_at AS createdAt
      FROM creatures ORDER BY id DESC
    `);
    const creatures: Creature[] = [];

    while (statement.step()) {
      creatures.push(statement.getAsObject() as unknown as Creature);
    }

    statement.free();
    return creatures;
  }

  static find(id: number): Creature | undefined {
    return this.all().find(creature => creature.id === id);
  }

  static create(creature: CreatureInput): void {
    DatabaseService.get().run(`
      INSERT INTO creatures
      (name, family, habitat, temperament, color, trait, notes, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      creature.name, creature.family, creature.habitat,
      creature.temperament, creature.color, creature.trait,
      creature.notes, new Date().toISOString()
    ]);

    DatabaseService.save();
  }

  static update(id: number, creature: CreatureInput): void {
    DatabaseService.get().run(`
      UPDATE creatures
      SET name = ?, family = ?, habitat = ?, temperament = ?,
          color = ?, trait = ?, notes = ?
      WHERE id = ?
    `, [
      creature.name, creature.family, creature.habitat,
      creature.temperament, creature.color, creature.trait,
      creature.notes, id
    ]);

    DatabaseService.save();
  }

  static delete(id: number): void {
    DatabaseService.get().run('DELETE FROM creatures WHERE id = ?', [id]);
    DatabaseService.save();
  }
}
