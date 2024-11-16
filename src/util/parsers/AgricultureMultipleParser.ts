import { DataEntry, Parser } from "./Parser";

type AgricultureMultipleRawData = {
  idx: number;
  first_session_dialogue: string[];
  retrieved_knowledge: string[];
}[];

interface AgricultureMultipleDataEntry extends DataEntry {
  dialog: string[];
  knowledge: string[];
}

type AgricultureMultipleData = AgricultureMultipleDataEntry[];

class AgricultureMultipleParser extends Parser<AgricultureMultipleDataEntry> {

  public override readOriginString(data: string): AgricultureMultipleData {
    const rawData: AgricultureMultipleRawData = JSON.parse(data);
    const result: AgricultureMultipleData = [];
    for (const entry of rawData) {
      result.push({
        id: entry.idx,
        dialog: entry.first_session_dialogue.map(val => val.trim()),
        knowledge: entry.retrieved_knowledge.map(val => val.trim())
      });
    }
    this.data = result;
    return result;
  }

  public override toOriginString(): string {
    const result: AgricultureMultipleRawData = [];
    for (const entry of this.data) {
      result.push({ idx: entry.id, first_session_dialogue: entry.dialog, retrieved_knowledge: entry.knowledge });
    }
    return JSON.stringify(result);
  }
}

export { AgricultureMultipleParser };
export type { AgricultureMultipleDataEntry, AgricultureMultipleData };