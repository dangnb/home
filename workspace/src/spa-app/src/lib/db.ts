import fs from 'fs/promises';
import path from 'path';

export async function getDbPath(collection: string) {
  return path.join(process.cwd(), 'src', 'data', `${collection}.json`);
}

export async function readDb(collection: string) {
  const dbPath = await getDbPath(collection);
  try {
    const data = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${collection}.json:`, error);
    return null;
  }
}

export async function writeDb(collection: string, data: any) {
  const dbPath = await getDbPath(collection);
  try {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing ${collection}.json:`, error);
    return false;
  }
}
