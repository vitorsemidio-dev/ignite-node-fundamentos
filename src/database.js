import fs from "node:fs/promises";

const databasePath = new URL("../database.json", import.meta.url);

export class Database {
  #database = {};

  constructor() {
    this.#load();
  }

  async #load() {
    try {
      const data = await fs.readFile(databasePath, { encoding: "utf-8" });
      this.#database = JSON.parse(data);
    } catch (error) {
      this.#persist();
    }
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database, null, 2));
  }

  insert(table, data) {
    this.#database[table] = this.#database[table] ?? [];
    this.#database[table].push(data);
    this.#persist();
  }

  select(table, search) {
    const data = this.#database[table] ?? [];

    if (search) {
      return data.filter((row) => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].includes(value);
        });
      });
    }

    return data;
  }

  delete(table, id) {
    const data = this.#database[table];
    const index = data.findIndex((item) => item.id === id);
    if (index === -1) {
      return false;
    }
    data.splice(index, 1);
    this.#persist();
    return true;
  }

  update(table, id, data) {
    const dataTable = this.#database[table];
    const index = dataTable.findIndex((item) => item.id === id);
    if (index === -1) {
      return false;
    }
    dataTable[index] = { ...dataTable[index], ...data };
    this.#persist();
    return true;
  }
}
