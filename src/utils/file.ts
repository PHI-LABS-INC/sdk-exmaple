import fs from 'fs';
import path from 'path';

export interface ProcessResult {
  configId: number;
  credId: number;
  artId?: number;
}

export const OUTPUT_FILE = path.join(__dirname, 'output', 'cred_art_results.json');

export function loadExistingResults(): ProcessResult[] {
  if (fs.existsSync(OUTPUT_FILE)) {
    const data = fs.readFileSync(OUTPUT_FILE, 'utf8');
    return JSON.parse(data);
  }
  return [];
}

export function saveResults(results: ProcessResult[]) {
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
  console.log(`Results saved to ${OUTPUT_FILE}`);
}
