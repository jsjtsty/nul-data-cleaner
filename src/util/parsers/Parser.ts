
interface DataEntry {
  id: number;
}

/**
 * General framework of JSON file parser.
 */
abstract class Parser<T> {
  protected data: T[];

  /**
   * Construct a parser by data.
   * @param data data to parse
   */
  public constructor(data: T[] = []) {
    this.data = data;
  }

  /**
   * Updates data in parser.
   * @param data data to update
   */
  public updateData(data: T[]): void {
    this.data = data;
  }

  /**
   * Converts source data string to structural data.
   * @param data source data string
   * @returns structural data, must be serializable
   */
  public abstract readOriginString(data: string): T[];

  /**
   * Reads JSON string to parser.
   * @param json JSON string to parse
   * @returns structural data parsed from the given JSON string
   */
  public readJsonString(json: string): T[] {
    this.data = JSON.parse(json);
    return this.data;
  }

  /**
   * Transforms data saved in the object to JSON string.
   * @returns JSON string transformed by the saved data
   */
  public toJsonString(): string {
    return JSON.stringify(this.data);
  }

  /**
   * Transforms data in the object to the raw format.
   * @returns data in the raw format
   */
  public abstract toOriginString(): string;
}

export { Parser };
export type { DataEntry };