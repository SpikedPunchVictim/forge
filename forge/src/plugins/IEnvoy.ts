/**
 * The IEnvoy object is the intermediary object used
 * when developing against the plugin. In the future it allows us
 * to create EnvoyMappings that transform one TEnvoy (from import)
 * to another TEnvoy (on export), and be able to reuse these
 * mappings.
 * 
 * The Envoy is broken up into 2 parts:
 *    - data: The raw data. For example, is an Excel file is imported, this
 *            would contain an Array of objects, where each object would
 *            represent a row. This would not include formatting data (cell colors,
 *            cell alignment, etc). Or a JSON file's data, without the additional
 *            info of spacing or line endings delimiters
 *    - metadata: The extra information that is applicable for that particular 
 *             data format. ie Formatting data in en Excel spreadsheet would be
 *             stored here while data would contain the cell data (without the formatting)
 */
export interface IEnvoy {
   data: any
   metadata: any
}