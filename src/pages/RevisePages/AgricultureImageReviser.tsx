import React, { ReactNode } from "react";
import { NulRealTimeEditorContext, NulRealTimeEditorFramework } from "../../framework/NulEditorFramework/NulRealTimeEditorFramework";
import { DataEntry } from "../../util/parsers/Parser";
import { Box, Card, CardContent, Checkbox, FormControlLabel, FormGroup, Stack, Typography } from "@mui/material";

const BASE_URL = 'http://106.75.215.104';

interface AgricultureImageEntry extends DataEntry {
  uuid: string;
  cropName: string;
  diseaseName: string;
  diseaseNameSource: string;
  diseaseType: string;
  path: string;
  available: boolean | null;
  sensible: boolean | null;
}

interface AgricultureImagePutReqeust {
  available: boolean | null;
  sensible: boolean | null;
}

const AgricultureImageReviser: React.FC = () => {

  const [available, setAvailable] = React.useState<boolean | null>(null);
  const [sensible, setSensible] = React.useState<boolean | null>(null);

  const revision = (context: NulRealTimeEditorContext<AgricultureImageEntry>): ReactNode => {
    return (
      <>
        <Stack display='flex' spacing={2}>
          <Stack direction='row' spacing={1} flexGrow={1} display='flex'>
            <Box flexGrow={1}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component='div'>
                    Domain
                  </Typography>
                  <Stack spacing={1} paddingTop='20px' paddingBottom='10px'>
                    <Stack direction='row' spacing={1}>
                      <Box width='150px'>
                        <Typography fontWeight={700}>Crop Name</Typography>
                      </Box>
                      <Typography>
                        {context.data.cropName}
                      </Typography>
                    </Stack>
                    <Stack direction='row' spacing={1}>
                      <Box width='150px'>
                        <Typography fontWeight={700}>Disease Name</Typography>
                      </Box>
                      <Typography>
                        {context.data.diseaseName}
                      </Typography>
                    </Stack>
                    <Stack direction='row' spacing={1}>
                      <Box width='150px'>
                        <Typography fontWeight={700}>Disease Source</Typography>
                      </Box>
                      <Typography>
                        {context.data.diseaseNameSource}
                      </Typography>
                    </Stack>
                    <Stack direction='row' spacing={1}>
                      <Box width='150px'>
                        <Typography fontWeight={700}>Disease Type</Typography>
                      </Box>
                      <Typography>
                        {context.data.diseaseType}
                      </Typography>
                    </Stack>
                    <Stack direction='row' spacing={1}>
                      <Box width='150px'>
                        <Typography fontWeight={700}>UUID</Typography>
                      </Box>
                      <Typography>
                        {context.data.uuid}
                      </Typography>
                    </Stack>
                    <Stack direction='row' spacing={1}>
                      <Box width='150px'>
                        <Typography fontWeight={700}>Path</Typography>
                      </Box>
                      <Typography>
                        {context.data.path}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
            <Box flexGrow={1}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component='div'>
                    Select
                  </Typography>
                  <Box paddingTop='11px'>
                    <FormGroup>
                      <FormControlLabel control={
                        <Checkbox checked={available !== null && available} indeterminate={available === null} onChange={(event) => {
                          setAvailable(event.target.checked);
                        }} />
                      } label="Available" />
                      <FormControlLabel control={
                        <Checkbox
                          disabled={context.data.diseaseType !== '虫害' || available === false}
                          checked={sensible !== null && sensible}
                          indeterminate={sensible === null}
                          onChange={(event) => {
                            setSensible(event.target.checked);
                          }}
                        />
                      } label="Sensible" />
                    </FormGroup>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Stack>
          <Stack>
            <Card>
              <CardContent>
                <Typography variant="h5" component='div'>
                  Image
                </Typography>
                <Stack paddingTop='20px' paddingBottom='10px'>
                  <img
                    style={{
                      maxWidth: '400px',
                      maxHeight: '400px'
                    }}
                    src={`${BASE_URL}/${encodeURIComponent(context.data.path)}`}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Stack>
      </>
    );
  };

  return (
    <>
      <NulRealTimeEditorFramework<AgricultureImageEntry, AgricultureImagePutReqeust>
        api='image'
        revision={revision}
        extractor={() => {
          return {
            available: available,
            sensible: sensible
          };
        }}
        onChange={(context) => {
          setAvailable(context.data.available);
          setSensible(context.data.sensible);
        }}
      />
    </>
  );
};

export { AgricultureImageReviser };