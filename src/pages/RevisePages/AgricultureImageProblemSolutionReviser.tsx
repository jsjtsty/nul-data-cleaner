import React from "react";
import { NulRealTimeEditorContext, NulRealTimeEditorFramework } from "../../framework/NulEditorFramework/NulRealTimeEditorFramework"
import { Stack, Box, Card, CardContent, Typography, FormControlLabel, Radio, RadioGroup, Switch } from "@mui/material";

const BASE_URL = 'http://106.75.215.104/dataset/image-problem';

interface AgricultureImageProblemSolutionEntry {
  document: {
    imagePath: string;
    id: number;
    category: number;
    originId: number;
    options: string[];
    question: string;
    imageId: string;
  },
  answer: number | null;
  rejected: boolean | null;
}

interface AgricultureImageProblemSolutionPutRequest {
  rejected: boolean;
  answer: number | null;
}

const AgricultureImageProblemSolutionReviser: React.FC = () => {

  const [answer, setAnswer] = React.useState<number | null>(null);
  const [rejected, setRejected] = React.useState<boolean>(false);

  const display = (context: NulRealTimeEditorContext<AgricultureImageProblemSolutionEntry>) => {
    return (
      <Stack display='flex' justifyContent='center' alignItems='center'>
        <Typography>
          {context.data.document.imageId}
        </Typography>
      </Stack>
    )
  };

  const revision = (context: NulRealTimeEditorContext<AgricultureImageProblemSolutionEntry>) => {
    const { question, options } = context.data.document;

    return (
      <Stack height='100%' spacing={2} overflow='auto'>
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
                  <RadioGroup
                    name='option-radio-group'
                    value={answer}
                    onChange={(event) => {
                      const selected = parseInt((event.target as HTMLInputElement).value);
                      setAnswer(selected);
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
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Box>
        {context.data.document.imagePath !== null &&
          <Box>
            <Card sx={{ height: '100%', overflowY: 'auto' }}>
              <CardContent>
                <Typography variant="h6" component='div' paddingBottom='10px'>
                  Picture
                </Typography>
                <Stack direction='row' display='flex'>
                  <img
                    style={{
                      maxWidth: '400px',
                      maxHeight: '400px'
                    }}
                    src={`${BASE_URL}/${encodeURIComponent(context.data.document.imagePath)}`}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Box>
        }
      </Stack>
    );
  };

  return (
    <NulRealTimeEditorFramework<AgricultureImageProblemSolutionEntry, AgricultureImageProblemSolutionPutRequest>
      api='image-problem'
      extractor={() => {
        return {
          answer, rejected
        };
      }}
      display={display}
      revision={revision}
      onChange={(context) => {
        const data = context.data;
        setAnswer(data.answer);
        setRejected(data.rejected ?? false);
      }}
    />
  )
};

export { AgricultureImageProblemSolutionReviser };