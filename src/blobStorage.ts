import Dexie, { Table } from "dexie";

export interface BlobRow {
  id?: number;
  name: string;
  blob: Blob | null;
  asBase64?: string | ArrayBuffer | null | undefined;
}

export class DexieBlobClass extends Dexie {
  blobs!: Table<BlobRow>;

  constructor() {
    super("blobsDatabase");
    this.version(1).stores({
      blobs: "++id, name, blob", // Primary key and indexed props
    });
  }
}

export const blobStorage = new DexieBlobClass();

export default blobStorage;
