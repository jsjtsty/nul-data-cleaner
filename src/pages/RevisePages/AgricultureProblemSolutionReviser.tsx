import React from "react";
import { NulRealTimeEditorContext, NulRealTimeEditorFramework } from "../../framework/NulEditorFramework/NulRealTimeEditorFramework"
import { Stack, Box, Card, CardContent, Typography, FormControlLabel, Radio, RadioGroup, Checkbox, Switch, FormGroup } from "@mui/material";

type AgricultureProblemSoltionQuestionType = '单选' | '多选' | '判断';

interface AgricultureProblemSolutionEntry {
  document: {
    id: number;
    category: number;
    originId: number;
    options: string[];
    question: string;
    questionType: AgricultureProblemSoltionQuestionType;
    classTask: string;
    domainSubtype: string;
    domainType: string;
    classType: string;
    goldAnswer: number[];
    type: string
  },
  answer: number[] | null;
  rejected: boolean | null;
}

interface AgricultureProblemSolutionPutRequest {
  rejected: boolean;
  answer: number[];
}

const AgricultureProblemSolutionReviser: React.FC = () => {

  const [answer, setAnswer] = React.useState<number[]>([]);
  const [rejected, setRejected] = React.useState<boolean>(false);

  const revision = (context: NulRealTimeEditorContext<AgricultureProblemSolutionEntry>) => {
    const { question, options, questionType, domainType, domainSubtype, classType, classTask } = context.data.document;

    return (
      <Stack height='100%' spacing={2}>
        <Box>
          <Card sx={{ height: '100%', overflowY: 'auto' }}>
            <CardContent>
              <Typography variant="h6" component='div' paddingBottom='10px'>
                Information
              </Typography>
              <Stack direction='row' display='flex'>
                <Stack flexGrow={1} spacing={1}>
                  <Stack direction='row' spacing={1}>
                    <Box width='140px'>
                      <Typography fontWeight={700}>Domain Type</Typography>
                    </Box>
                    <Typography>
                      {domainType}
                    </Typography>
                  </Stack>
                  <Stack direction='row' spacing={1}>
                    <Box width='140px'>
                      <Typography fontWeight={700}>Class Type</Typography>
                    </Box>
                    <Typography>
                      {classType}
                    </Typography>
                  </Stack>
                  <Stack direction='row' spacing={1}>
                    <Box width='140px'>
                      <Typography fontWeight={700}>Type</Typography>
                    </Box>
                    <Typography>
                      {questionType}
                    </Typography>
                  </Stack>
                </Stack>
                <Stack flexGrow={1} spacing={1}>
                  <Stack direction='row' spacing={1}>
                    <Box width='140px'>
                      <Typography fontWeight={700}>Domain Subtype</Typography>
                    </Box>
                    <Typography>
                      {domainSubtype}
                    </Typography>
                  </Stack>
                  <Stack direction='row' spacing={1}>
                    <Box width='140px'>
                      <Typography fontWeight={700}>Class Task</Typography>
                    </Box>
                    <Typography>
                      {classTask}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Box>
        <Box>
          <Card sx={{ height: '100%', overflowY: 'auto' }}>
            <CardContent>
              <Typography variant="h6" component='div' paddingBottom='10px'>
                Process
              </Typography>
              <Stack spacing={2}>
                <Stack direction='row' spacing={1}>
                  <Box width='90px'>
                    <Typography fontWeight={700}>Question</Typography>
                  </Box>
                  <Typography>
                    {question}
                  </Typography>
                </Stack>
                <Stack direction='row' spacing={1} alignItems='center'>
                  <Box width='80px'>
                    <Typography fontWeight={700}>Rejected</Typography>
                  </Box>
                  <Switch checked={rejected} onChange={(event) => setRejected(event.target.checked)} color="error" />
                </Stack>
                <Stack spacing={1}>
                  {
                    questionType === '多选' ? (
                      <FormGroup>
                        {options.map((val, index) => (
                          <FormControlLabel
                            key={index}
                            control={
                              <Checkbox
                                checked={answer.includes(index)}
                                onChange={(event) => {
                                  const selected = index;
                                  if (event.target.checked) {
                                    setAnswer([...answer, selected].sort());
                                  } else {
                                    setAnswer(answer.filter((item) => item !== selected));
                                  }
                                }}
                                disabled={rejected}
                              />
                            }
                            label={`${String.fromCharCode(65 + index)}. ${val}`}
                          />
                        ))}
                      </FormGroup>
                    ) : (
                      <RadioGroup
                        name='option-radio-group'
                        value={answer.length > 0 ? answer[0] : null}
                        onChange={(event) => {
                          const selected = parseInt((event.target as HTMLInputElement).value);
                          setAnswer([selected]);
                        }}
                      >
                        {options.map((val, index) =>
                          <FormControlLabel
                            value={index}
                            control={<Radio />}
                            disabled={rejected}
                            label={String.fromCharCode(65 + index) + '. ' + val}
                          />
                        )}
                      </RadioGroup>
                    )
                  }
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Stack>
    );
  };

  return (
    <NulRealTimeEditorFramework<AgricultureProblemSolutionEntry, AgricultureProblemSolutionPutRequest>
      api='problem'
      extractor={() => {
        return {
          answer, rejected
        };
      }}
      revision={revision}
      onChange={(context) => {
        const data = context.data;
        setAnswer(data.answer ?? []);
        setRejected(data.rejected ?? false);
      }}
    />
  )
};

export { AgricultureProblemSolutionReviser };