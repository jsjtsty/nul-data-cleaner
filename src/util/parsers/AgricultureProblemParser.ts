import { DataEntry, Parser } from "./Parser";

enum AgricultureProblemType {
  SINGLE = '单选',
  MULTIPLE = '多选',
  JUDGE = '判断',
  ANSWER = '简答'
}

interface AgricultureProblemRawDataEntry {
  id: number;
  type: string;
  question_type: AgricultureProblemType;
  question: string;
};

interface AgricultureProblemChoiceRawDataEntry extends AgricultureProblemRawDataEntry {
  options: { [key: string]: string }
  answer: string;
}

interface AgricultureProblemAnswerRawDataEntry extends AgricultureProblemRawDataEntry {
  answer: string;
}

interface AgricultureProblemDataEntry extends DataEntry {
  type: AgricultureProblemType;
  accuracy: {
    problem: boolean;
    answer: boolean;
  },
  domain: {
    type: string | null;
    subtype: string | null;
  };
  class: {
    class: string | null;
    task: string | null;
  };
  question: string;
}

interface AgricultureProblemChoiceDataEntry extends AgricultureProblemDataEntry {
  options: string[];
  answer: number[];
}

interface AgricultureProblemAnswerDataEntry extends AgricultureProblemDataEntry {
  answer: string;
}

type AgricultureProblemData = AgricultureProblemDataEntry[];

class AgricultureProblemParser extends Parser<AgricultureProblemDataEntry> {

  public override readOriginString(data: string): AgricultureProblemData {
    const parsed = JSON.parse(data) as (AgricultureProblemChoiceRawDataEntry | AgricultureProblemAnswerRawDataEntry)[];
    const result: AgricultureProblemData = [];

    for (const entry of parsed) {
      if (!Object.values(AgricultureProblemType).includes(entry.question_type as AgricultureProblemType)) {
        throw new Error(`Invalid problem type on entry #${entry.id}.`);
      }
      const type = entry.question_type as AgricultureProblemType;

      if (type === AgricultureProblemType.ANSWER) {
        const data = entry as AgricultureProblemAnswerRawDataEntry;
        const transformed: AgricultureProblemAnswerDataEntry = {
          id: data.id,
          type: type,
          question: data.question,
          answer: data.answer,
          accuracy: {
            problem: true,
            answer: true
          },
          domain: {
            type: entry.type,
            subtype: null
          },
          class: {
            class: null,
            task: null
          }
        };
        result.push(transformed);
      } else {
        const data = entry as AgricultureProblemChoiceRawDataEntry;
        const sortedKeys = Object.keys(data.options).sort();
        const keyMap = new Map<string, number>();
        let index = 0;
        for (const key of sortedKeys) {
          keyMap.set(key, index);
          ++index;
        }

        const options: string[] = [];
        for (const key of sortedKeys) {
          options.push(data.options[key]);
        }

        const answer: number[] = [];
        for (const item of entry.answer) {
          const index = keyMap.get(item);
          if (index == undefined) {
            throw new Error(`Invalid answer on entry #${entry.id}.`);
          }
          answer.push(index);
        }

        const transformed: AgricultureProblemChoiceDataEntry = {
          id: data.id,
          type: type,
          question: data.question,
          options: options,
          answer: answer,
          accuracy: {
            problem: true,
            answer: true
          },
          domain: {
            type: data.type,
            subtype: null
          },
          class: {
            class: null,
            task: null
          }
        };

        result.push(transformed);
      }
    }

    this.data = result;
    return result;
  }

  public override toOriginString(): string {
    return JSON.stringify(this.data);
  }
}

class AgricultureProblemResultParser extends AgricultureProblemParser {
  public override readOriginString(data: string): AgricultureProblemData {
    const result = JSON.parse(data);
    for (const entry of result) {
      if (!('accuracy' in entry)) {
        entry['accuracy'] = {
          problem: true,
          answer: true
        };
      }
    }
    return result;
  }
}

export { AgricultureProblemParser, AgricultureProblemResultParser, AgricultureProblemType };
export type { AgricultureProblemDataEntry, AgricultureProblemData, AgricultureProblemChoiceDataEntry, AgricultureProblemAnswerDataEntry };