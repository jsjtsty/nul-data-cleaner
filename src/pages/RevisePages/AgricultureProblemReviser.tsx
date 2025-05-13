import React, { ReactNode } from "react";
import { NulEditorContext, NulEditorFramework } from "../../framework/NulEditorFramework/NulEditorFramework";
import { AgricultureProblemAnswerDataEntry, AgricultureProblemChoiceDataEntry, AgricultureProblemDataEntry, AgricultureProblemParser, AgricultureProblemType } from "../../util/parsers/AgricultureProblemParser";
import { Autocomplete, Box, Card, CardContent, FormControlLabel, Stack, Switch, TextField, Typography } from "@mui/material";
import typeData from "../../data/AgricultureProblemTypes.json";

const domainOptions = typeData.domain.map(entry => entry.name);
const classOptions = typeData.class.map(entry => entry.name);

const AgricultureProblemReviser: React.FC = () => {

  const [domainType, setDomainType] = React.useState<string | null>(null);
  const [domainSubType, setDomainSubType] = React.useState<string | null>(null);
  const [classType, setClassType] = React.useState<string | null>(null);
  const [classTask, setClassTask] = React.useState<string | null>(null);

  const [problemAccuracy, setProblemAccuracy] = React.useState<boolean>(true);
  const [answerAccuracy, setAnswerAccuracy] = React.useState<boolean>(true);

  const [domainSubOptions, setDomainSubOptions] = React.useState<string[]>([]);
  const [taskOptions, setTaskOptions] = React.useState<string[]>([]);

  const revision = (context: NulEditorContext<AgricultureProblemDataEntry>): ReactNode => {

    const { data, id } = context;

    return (
      <Stack display='flex' spacing={2}>
        <Stack direction='row' spacing={1} flexGrow={1} display='flex'>
          <Box flexGrow={1}>
            <Card>
              <CardContent>
                <Typography variant="h5" component='div'>
                  Domain
                </Typography>
                <Stack spacing={2} paddingTop='20px'>
                  <Autocomplete
                    options={domainOptions}
                    value={domainType}
                    renderInput={(params) => <TextField {...params} label='Domain' />}
                    onChange={(_event, newValue) => {
                      setDomainType(newValue);
                      if (newValue !== null) {
                        setDomainSubType(null);
                        setDomainSubOptions(
                          typeData.domain.find(val => val.name === newValue)?.children.map(val => val.name) ?? []
                        );
                      }
                    }}
                  />
                  <Autocomplete
                    options={domainSubOptions}
                    value={domainSubType}
                    renderInput={(params) => <TextField {...params} label='Domain Subtype' />}
                    onChange={(_event, newValue) => {
                      setDomainSubType(newValue);
                    }}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Box>
          <Box flexGrow={1}>
            <Card>
              <CardContent>
                <Typography variant="h5" component='div'>
                  Class
                </Typography>
                <Stack spacing={2} paddingTop='20px'>
                  <Autocomplete
                    options={classOptions}
                    value={classType}
                    renderInput={(params) => <TextField {...params} label='Class' />}
                    onChange={(_event, newValue) => {
                      setClassType(newValue);
                      if (newValue !== null) {
                        setClassTask(null);
                        setTaskOptions(
                          typeData.class.find(val => val.name === newValue)?.children.map(val => val.name) ?? []
                        );
                      }
                    }}
                  />
                  <Autocomplete
                    options={taskOptions}
                    value={classTask}
                    renderInput={(params) => <TextField {...params} label='Task' />}
                    onChange={(_event, newValue) => {
                      setClassTask(newValue);
                    }}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Stack>
        <Box>
          <Card>
            <CardContent>
              <Typography variant="h5" component='div'>
                Information
              </Typography>
              <Stack spacing={2} paddingTop='20px'>
                <Stack spacing={2} direction="row" alignItems="center">
                  <Box>
                    <Typography fontWeight={700}>Accuracy</Typography>
                  </Box>
                  <FormControlLabel control={<Switch checked={problemAccuracy} onChange={(event) => {
                    setProblemAccuracy(event.target.checked);
                  }} />} label="Problem and Choices" />
                  <FormControlLabel control={<Switch checked={answerAccuracy} onChange={(event) => {
                    setAnswerAccuracy(event.target.checked);
                  }}/>} label="Answer" />
                </Stack>

                <Stack spacing={1}>
                  <Box>
                    <Typography fontWeight={700}>Question</Typography>
                  </Box>
                  <Typography>
                    {data[id].question}
                  </Typography>
                </Stack>
                <Stack spacing={1}>
                  <Box>
                    <Typography fontWeight={700}>Answer</Typography>
                  </Box>
                  {data[id].type === AgricultureProblemType.ANSWER ?
                    (data[id] as AgricultureProblemAnswerDataEntry).answer
                    :
                    (data[id] as AgricultureProblemChoiceDataEntry).options.map((value, index) =>
                      <Stack spacing={1}>
                        <Typography color={(data[id] as AgricultureProblemChoiceDataEntry).answer.indexOf(index) !== -1 ? 'success' : undefined}>
                          {String.fromCharCode(65 + index) + '. ' + value}
                        </Typography>
                      </Stack>
                    )}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Stack>
    );
  };

  return (
    <NulEditorFramework
      parser={new AgricultureProblemParser()}
      store='problems'
      revision={revision}
      extractor={(data) => {
        return {
          ...data,
          accuracy: {
            problem: problemAccuracy,
            answer: answerAccuracy
          },
          domain: {
            type: domainType,
            subtype: domainSubType
          },
          class: {
            class: classType,
            task: classTask
          }
        };
      }}
      onChange={(context) => {
        const data = context.data[context.id];
        setDomainType(data.domain.type);
        setDomainSubOptions(
          typeData.domain.find(val => val.name === data.domain.type)?.children.map(val => val.name) ?? []
        );
        setDomainSubType(data.domain.subtype);
        setClassType(data.class.class);
        setTaskOptions(
          typeData.class.find(val => val.name === data.class.class)?.children.map(val => val.name) ?? []
        );
        setClassTask(data.class.task);
        setProblemAccuracy(data.accuracy.problem);
        setAnswerAccuracy(data.accuracy.answer);
      }}
      onRestore={(origin) => {
        setDomainType(origin.domain.type);
        setDomainSubOptions(
          typeData.domain.find(val => val.name === origin.domain.type)?.children.map(val => val.name) ?? []
        );
        setDomainSubType(origin.domain.subtype);
        setClassType(origin.class.class);
        setTaskOptions(
          typeData.class.find(val => val.name === origin.class.class)?.children.map(val => val.name) ?? []
        );
        setClassTask(origin.class.task);
        setProblemAccuracy(origin.accuracy.problem);
        setAnswerAccuracy(origin.accuracy.answer);
      }}
    />
  );
};

export { AgricultureProblemReviser };