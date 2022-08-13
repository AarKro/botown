/*
  temporary in-memory database solution
  quick solution thrown together to test before we add an actual database
*/

interface Entity {
  id: string;
}

type Table<T extends Entity> = T[];

export interface Player extends Entity {
  inventory: Inventory;
}

export interface Inventory {
  money: number;
  items: string[];
}

const getDefaultAccessors = <T extends Entity>(table: Table<T>, name: string) => {
  return {
    get(id: string) {
      return table.find(entity => entity.id === id);
    },
    create(entity: T) {
      table.push(entity);
    },
    update(entity: T) {
      const index = table.findIndex(existing => existing.id === entity.id);
      if (index) {
        const existing = this.get(entity.id);
        table[index] = {...existing, ...entity};
      } else {
        throw Error(`Error updating ${name} ${entity}`);
      }
    },
    delete(id: string) {
      const index = table.findIndex(existing => existing.id === id);
      if (index) {
        table.splice(index, 1);
      } else {
        throw Error(`Error deleting ${name} with ID ${id}`);
      }
    }
  };
};

const createAccessors = <T extends Entity>(table: Table<T>, name: string, template: T) => {
  const accessors = getDefaultAccessors(table, name);
  return {...accessors, create: (entity?: Partial<T>) => {
    accessors.create({...template, ...entity});
  }};
};

const _DB: {
  players: Table<Player>
} = {
  players: [],
};

export const PlayerService = createAccessors(_DB.players, "players", {
  id: "",
  inventory: {
    money: 0,
    items: [],
  }
});