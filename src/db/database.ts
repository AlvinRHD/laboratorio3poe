import initSqlJs from 'sql.js/dist/sql-wasm.js';
import type { Database } from 'sql.js';
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url';
import { EXAMPLES } from '../models/Creature';

const STORAGE_KEY = 'bestiario.sqlite.v1';

export class DatabaseService {
  private static db: Database;

  static async init(): Promise<void> {
    const SQL = await initSqlJs({ locateFile: () => wasmUrl });
    const saved = localStorage.getItem(STORAGE_KEY);

    // Si existe una base guardada, no volvemos a cargar los ejemplos.
    if (saved) {
      const bytes = Uint8Array.from(atob(saved), char => char.charCodeAt(0));
      this.db = new SQL.Database(bytes);
    } else {
      this.db = new SQL.Database();
    }

    this.db.run(`
      CREATE TABLE IF NOT EXISTS creatures (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        family TEXT NOT NULL,
        habitat TEXT NOT NULL,
        temperament TEXT NOT NULL,
        color TEXT NOT NULL,
        trait TEXT NOT NULL,
        notes TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `);

    if (!saved) {
      const insert = this.db.prepare(`
        INSERT INTO creatures
        (name, family, habitat, temperament, color, trait, notes, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const creature of EXAMPLES) {
        insert.run([
          creature.name, creature.family, creature.habitat,
          creature.temperament, creature.color, creature.trait,
          creature.notes, new Date().toISOString()
        ]);
      }

      insert.free();
      this.save();
    }
  }

  static get(): Database {
    if (!this.db) throw new Error('SQLite todavía no está disponible.');
    return this.db;
  }

  static save(): void {
    const bytes = this.get().export();
    let binary = '';

    // Evita desbordar la pila al convertir bases con muchos registros.
    for (let i = 0; i < bytes.length; i += 8192) {
      binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
    }

    localStorage.setItem(STORAGE_KEY, btoa(binary));
  }
}
