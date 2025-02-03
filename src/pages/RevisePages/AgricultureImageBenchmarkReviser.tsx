import React, { ReactNode } from "react";
import { NulRealTimeEditorContext, NulRealTimeEditorFramework } from "../../framework/NulEditorFramework/NulRealTimeEditorFramework";
import { DataEntry } from "../../util/parsers/Parser";
import { Box, Card, CardContent, FormControlLabel, Radio, RadioGroup, Stack, Typography } from "@mui/material";

const BASE_URL = 'http://106.75.215.104';

type Question = 'True' | 'False' | 'Perception' | null;
type Options = 'True' | 'False' | 'Options' | null;

interface AgricultureImageBenchmarkEntry extends DataEntry {
  document: {
    questionId: string;
    answer: number;
    aspect: string;
    aspectKnowledge: string;
    cropName: string;
    diseaseName: string;
    diseaseType: string;
    image: string;
    question: string;
    options: string[];
    optionsAnalysis: string[];
    solvingLogic: string[];
    backgroundKnowledge: string;
    uuid: string;
  },
  question: Question;
  options: Options;
  logic: boolean | null;
  optionAnalysis: boolean | null;
  answer: boolean | null;
}

interface AgricultureImageBenchmarkPutRequest {
  question: Question;
  options: Options;
  logic: boolean | null;
  optionAnalysis: boolean | null;
  answer: boolean | null;
}

const AgricultureImageBenchmarkReviser: React.FC = () => {

  const [question, setQuestion] = React.useState<Question>(null);
  const [logic, setLogic] = React.useState<boolean | null>(null);
  const [options, setOptions] = React.useState<Options>(null);
  const [optionAnalysis, setOptionAnalysis] = React.useState<boolean | null>(null);
  const [answer, setAnswer] = React.useState<boolean | null>(null);

  const display = (context: NulRealTimeEditorContext<AgricultureImageBenchmarkEntry>): ReactNode => {
    return (
      <Stack display='flex' justifyContent='center' alignItems='center'>
        <Typography>QuestionID: {context.data.document.questionId}</Typography>
        <Typography>UUID: {context.data.document.uuid}</Typography>
      </Stack>
    );
  };

  const revision = (context: NulRealTimeEditorContext<AgricultureImageBenchmarkEntry>): ReactNode => {
    return (
      <Stack direction='row' height='100%' spacing={2}>
        <Box width='50%'>
          <Card sx={{ height: '100%', overflowY: 'auto' }}>
            <CardContent>
              <Typography variant="h6" component='div' paddingBottom='10px'>
                Knowledge
              </Typography>
              <Stack spacing={2}>
                <Stack spacing={1}>
                  <Box width='120px'>
                    <Typography fontWeight={700}>Image Preview</Typography>
                  </Box>
                  <Box display='flex' alignContent='center' justifyContent='center'>
                    <img
                      style={{
                        maxWidth: '300px',
                        maxHeight: '300px'
                      }}
                      src={`${BASE_URL}/images/${encodeURIComponent(context.data.document.image)}`}
                    />
                  </Box>
                </Stack>
                <Stack direction='row' spacing={1}>
                  <Box width='120px'>
                    <Typography fontWeight={700}>Crop Name</Typography>
                  </Box>
                  <Typography>
                    {context.data.document.cropName}
                  </Typography>
                </Stack>
                <Stack direction='row' spacing={1}>
                  <Box width='120px'>
                    <Typography fontWeight={700}>Disease Type</Typography>
                  </Box>
                  <Typography>
                    {context.data.document.diseaseType}
                  </Typography>
                </Stack>
                <Stack direction='row' spacing={1}>
                  <Box width='120px'>
                    <Typography fontWeight={700}>Disease Name</Typography>
                  </Box>
                  <Typography>
                    {context.data.document.diseaseName}
                  </Typography>
                </Stack>
                <Stack direction='row' spacing={1}>
                  <Box width='120px'>
                    <Typography fontWeight={700}>Aspect</Typography>
                  </Box>
                  <Typography>
                    {context.data.document.aspect}
                  </Typography>
                </Stack>
                <Stack spacing={1}>
                  <Box width='160px'>
                    <Typography fontWeight={700}>Aspect Knowledge</Typography>
                  </Box>
                  <Typography>
                    {context.data.document.aspectKnowledge}
                  </Typography>
                </Stack>
                <Stack>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Box>
        <Box width='50%'>
          <Card sx={{ height: '100%', overflowY: 'auto' }}>
            <CardContent>
              <Typography variant="h6" component='div' paddingBottom='10px'>
                Process
              </Typography>
              <Stack spacing={2}>
                <Stack spacing={1}>
                  <Box width='190px'>
                    <Typography fontWeight={700}>Background Knowledge</Typography>
                  </Box>
                  <Typography>
                    {context.data.document.backgroundKnowledge}
                  </Typography>
                </Stack>
                <Stack spacing={1}>
                  <Stack direction='row' alignItems='center'>
                    <Box>
                      <Typography fontWeight={700} width='100px'>Question</Typography>
                    </Box>
                    <RadioGroup
                      name='question-radio-group'
                      value={question}
                      onChange={(event) => {
                        setQuestion((event.target as HTMLInputElement).value as Question);
                      }}
                      row
                    >
                      <FormControlLabel value='True' control={<Radio />} label="True" />
                      <FormControlLabel value='Perception' control={<Radio />} label="Perception" />
                      <FormControlLabel value='False' control={<Radio />} label="False" />
                    </RadioGroup>
                  </Stack>
                  <Typography>
                    {context.data.document.question}
                  </Typography>
                </Stack>
                <Stack spacing={1}>
                  <Stack direction='row' alignItems='center'>
                    <Box>
                      <Typography fontWeight={700} width='100px'>Options</Typography>
                    </Box>
                    <RadioGroup
                      name='options-radio-group'
                      value={options}
                      onChange={(event) => {
                        setOptions((event.target as HTMLInputElement).value as Options);
                      }}
                      row
                    >
                      <FormControlLabel value='True' control={<Radio />} label="True" />
                      <FormControlLabel value='Simple' control={<Radio />} label='Simple' />
                      <FormControlLabel value='False' control={<Radio />} label="False" />
                    </RadioGroup>
                  </Stack>
                  <Stack>
                    {context.data.document.options.map((option, index) =>
                      <Typography color={context.data.document.answer === index ? 'green' : undefined}>
                        {String.fromCharCode(65 + index)}. {option}
                      </Typography>
                    )}
                  </Stack>
                </Stack>
                <Stack spacing={1}>
                  <Stack direction='row' alignItems='center'>
                    <Box>
                      <Typography fontWeight={700} width='100px'>Logic</Typography>
                    </Box>
                    <RadioGroup
                      name='logic-radio-group'
                      value={logic}
                      onChange={(event) => {
                        setLogic((event.target as HTMLInputElement).value === 'true');
                      }}
                      row
                    >
                      <FormControlLabel value='true' control={<Radio />} label="True" />
                      <FormControlLabel value='false' control={<Radio />} label="False" />
                    </RadioGroup>
                  </Stack>
                  <Stack>
                    {context.data.document.solvingLogic.map(logic =>
                      <Typography>{logic}</Typography>
                    )}
                  </Stack>
                </Stack>
                <Stack spacing={1}>
                  <Stack direction='row' alignItems='center'>
                    <Box>
                      <Typography fontWeight={700} width='140px'>Option Analysis</Typography>
                    </Box>
                    <RadioGroup
                      name='analysis-radio-group'
                      value={optionAnalysis}
                      onChange={(event) => {
                        setOptionAnalysis((event.target as HTMLInputElement).value === 'true');
                      }}
                      row
                    >
                      <FormControlLabel value='true' control={<Radio />} label="True" />
                      <FormControlLabel value='false' control={<Radio />} label="False" />
                    </RadioGroup>
                  </Stack>
                  <Stack>
                    {context.data.document.optionsAnalysis.map((analysis, index) =>
                      <Typography color={context.data.document.answer === index ? 'green' : undefined}>
                        {analysis}
                      </Typography>
                    )}
                  </Stack>
                </Stack>
                <Stack spacing={1}>
                  <Stack direction='row' alignItems='center'>
                    <Box>
                      <Typography fontWeight={700} width='100px'>Answer</Typography>
                    </Box>
                    <RadioGroup
                      name='analysis-radio-group'
                      value={answer}
                      onChange={(event) => {
                        setAnswer((event.target as HTMLInputElement).value === 'true');
                      }}
                      row
                    >
                      <FormControlLabel value='true' control={<Radio />} label="True" />
                      <FormControlLabel value='false' control={<Radio />} label="False" />
                    </RadioGroup>
                  </Stack>
                  <Typography variant="h5">
                    {String.fromCharCode(65 + context.data.document.answer)}
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Stack>
    );
  };


  return (
    <NulRealTimeEditorFramework<AgricultureImageBenchmarkEntry, AgricultureImageBenchmarkPutRequest>
      api='image-benchmark'
      revision={revision}
      extractor={() => {
        return {
          question, options, logic, optionAnalysis, answer
        };
      }}
      onChange={(context) => {
        setQuestion(context.data.question);
        setOptions(context.data.options);
        setLogic(context.data.logic);
        setOptionAnalysis(context.data.optionAnalysis);
        setAnswer(context.data.answer);
      }}
      display={display}
    />
  )
};

export { AgricultureImageBenchmarkReviser };