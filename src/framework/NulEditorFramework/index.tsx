import { Box, Stack } from '@mui/material';
import NulRevisionContainer from '../NulRevisionContainer';
import React, { ReactNode } from 'react';
import { NulReviseDatabase } from '../../util/database/NulReviseDatabase';
import { DataEntry, Parser } from '../../util/parsers/Parser';
import NulAlertBox from '../../components/NulAlertBox';

interface NulEditorContext<T extends DataEntry> {
  data: T[];
  origin: T[];
  id: number;
}

interface NulEditorFrameworkProps<T extends DataEntry> {
  parser: Parser<T>;
  store: string;
  display?: (context: NulEditorContext<T>) => ReactNode;
  revision: (context: NulEditorContext<T>) => ReactNode;
  extractor: (data: T) => T;
  onChange: (context: NulEditorContext<T>) => void;
  onRestore: (origin: T) => void;
}

const NulEditorFramework = <T extends DataEntry>(props: NulEditorFrameworkProps<T>) => {

  const { parser, store, display, revision, extractor, onChange, onRestore } = props;

  const [data, setData] = React.useState<T[]>([]);
  const [origin, setOrigin] = React.useState<T[]>([]);
  const [id, setId] = React.useState<number>(0);
  const [error, setError] = React.useState<boolean>(false);
  const [dataLoaded, setDataLoaded] = React.useState<boolean>(false);
  const [database, setDatabase] = React.useState<NulReviseDatabase<T> | null>(null);

  const loadData = async () => {
    const database = new NulReviseDatabase<T>(store);
    await database.connect();
    setDatabase(database);
    const loadedData = await database.load();
    setData(loadedData.map(entry => entry.revised));
    setOrigin(loadedData.map(entry => entry.origin));
    setDataLoaded(true);
  };

  React.useEffect(() => {
    if (!dataLoaded) {
      loadData().catch((err) => console.error(err));
    } else {
      onChange({ origin, data, id });
    }
  }, [dataLoaded, id]);

  const storePage = async (): Promise<void> => {
    const entry = extractor(data[id]);
    if (!database) {
      throw Error('Invalid data.');
    }
    await database.revise(data[id].id, entry);
    setData(data.map(value => value.id === data[id].id ? entry : value));
  };

  const downloadFile = (fileName: string, content: string) => {
    const blob = new Blob([content], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const context = { origin, data, id };

  return (
    <>
      <Stack direction='row' display='flex' width='100%' height='100%'>
        <NulRevisionContainer
          page={id + 1}
          total={data.length}
          onChange={(page) => {
            storePage()
              .then(() => {
                setId(page - 1);
                onChange({ id, origin, data });
              }).catch((err) => {
                console.log(err);
                setError(true);
              });
          }}
          onSave={() => {
            storePage()
              .then(() => {
                parser.updateData(data);
                const result = parser.toOriginString();
                downloadFile('result.json', result);
              }).catch(() => {
                setError(true);
              });
          }}
          onRestore={() => {
            onRestore(origin[id]);
          }}
        >
          {dataLoaded && display && display(context)}
        </NulRevisionContainer>
        <Box padding='20px' flexGrow={1} maxHeight='100%'>
          {dataLoaded && revision(context)}
        </Box>
      </Stack>
      <NulAlertBox
        open={error}
        severity='warning'
        title='Error'
        message='Error occured.'
        onClose={() => {
          setError(false);
        }}
        autoHideDuration={2000}
      />
    </>
  );
};

export default NulEditorFramework;
export type { NulEditorContext };
