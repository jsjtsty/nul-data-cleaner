import { DataEntry } from "../parsers/Parser";

interface NulReviseEntry<T extends DataEntry> {
  id: number;
  origin: T;
  revised: T;
}

class NulReviseDatabase<T extends DataEntry> {
  protected db: IDBDatabase | null = null;
  protected storeName: string;

  constructor(storeName: string) {
    this.storeName = storeName;
  }

  async connect(): Promise<void> {
    const newVersion = await new Promise<number>((resolve, reject) => {
      const request = indexedDB.open('nul_revise');

      request.onsuccess = (event: Event) => {
        this.db = (event.target as IDBOpenDBRequest).result;

        const dataStoreExist = this.db.objectStoreNames.contains(this.storeName);
        const newVersion = dataStoreExist ? 0 : this.db.version + 1;
        resolve(newVersion);
      };

      request.onerror = (event: Event) => {
        reject(event);
      };
    });

    if (!newVersion) return;

    this.db?.close();

    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.open('nul_revise', newVersion);

      request.onupgradeneeded = (event: Event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
      };

      request.onsuccess = (event: Event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onerror = (event: Event) => {
        reject(event);
      };
    });
  }

  async read(id: number): Promise<NulReviseEntry<T>> {
    return new Promise<NulReviseEntry<T>>((resolve, reject) => {
      if (!this.db) {
        reject('Database connect failed.');
        return;
      }

      const transaction = this.db.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);

      const getRequest = store.get(id);

      getRequest.onsuccess = (event) => {
        const target = event.target as IDBRequest;
        const record = target.result as NulReviseEntry<T>;
        if (record) {
          resolve(record);
        } else {
          reject('Record not found.');
        }
      };

      getRequest.onerror = (event) => {
        const target = event.target as IDBRequest;
        reject(target.error);
      };
    });
  }

  async revise(id: number, revised: T): Promise<void> {
    const record = await this.read(id);
    record.revised = revised;

    return new Promise<void>((resolve, reject) => {
      if (!this.db) {
        reject('Database connect failed.');
        return;
      }

      const transaction = this.db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);

      const putRequest = store.put(record);

      putRequest.onsuccess = () => {
        resolve();
      };

      putRequest.onerror = (event) => {
        const target = event.target as IDBRequest;
        reject(target.error);
      };
    });
  }

  async load(): Promise<NulReviseEntry<T>[]> {
    return new Promise<NulReviseEntry<T>[]>((resolve, reject) => {
      if (!this.db) {
        reject('Database connect failed.');
        return;
      }

      const transaction = this.db.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);

      const result: NulReviseEntry<T>[] = [];
      const cursorRequest = store.openCursor();

      cursorRequest.onsuccess = (event) => {
        const target = event.target as IDBRequest;
        const cursor = target.result;
        if (cursor) {
          result.push(cursor.value as NulReviseEntry<T>);
          cursor.continue();
        } else {
          resolve(result);
        }
      };

      cursorRequest.onerror = (event) => {
        const target = event.target as IDBRequest;
        reject(target.error);
      };
    });
  }

  async write(data: T[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!this.db) {
        reject('Database connect failed.');
        return;
      }

      const transaction = this.db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);

      for (const entry of data) {
        const addRequest = store.add({
          id: entry.id,
          origin: entry,
          revised: entry
        });

        addRequest.onerror = (event) => {
          const target = event.target as IDBRequest;
          transaction.abort();
          console.log(target.error);
          reject(target.error);
        };
      }

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = (event) => {
        const target = event.target as IDBRequest;
        reject(target.error);
      };
    });
  }

  close() {
    this.db?.close();
    this.db = null;
  }
}

export { NulReviseDatabase };
export type { NulReviseEntry };