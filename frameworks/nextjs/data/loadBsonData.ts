import AdmZip from 'adm-zip';
import { deserialize } from 'bson';
import { resolve } from 'node:path';

export function loadBsonFromZip(zipPath: string): any[] {
  console.log('check zipPath', resolve(zipPath))
  const zip = new AdmZip(zipPath);
  const entries = zip.getEntries();
  const documents: any[] = [];

  entries.forEach((entry) => {
    if (entry.entryName.endsWith('.bson')) {
      const buffer = entry.getData();
      try {
        const doc = deserialize(buffer);
        documents.push(doc);
      } catch (err) {
        console.warn(`Failed to parse ${entry.entryName}:`, err);
      }
    }
  });

  return documents;
}
