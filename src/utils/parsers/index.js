/**
 * Main parser index - exports all parsers and the main routing function
 */
export { parseFitFile } from './fitParser';
export { parseTcxFile } from './tcxParser';
export { parseCsvFile } from './csvParser';
export { parseVO2MaxFile } from './vo2MaxParser';

/**
 * Main parser function that routes to the appropriate parser based on file type
 */
export const parseSwimFile = async (file) => {
  const { parseFitFile } = await import('./fitParser');
  const { parseTcxFile } = await import('./tcxParser');
  const { parseCsvFile } = await import('./csvParser');

  const extension = file.name.split('.').pop().toLowerCase();

  switch (extension) {
    case 'fit':
      return await parseFitFile(file);
    case 'tcx':
      return await parseTcxFile(file);
    case 'csv':
      return await parseCsvFile(file);
    default:
      throw new Error(`Unsupported file type: .${extension}`);
  }
};
