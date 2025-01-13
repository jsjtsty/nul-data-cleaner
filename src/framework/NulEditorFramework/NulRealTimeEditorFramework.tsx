import { ReactNode } from "react";
import { DataEntry } from "../../util/parsers/Parser";
import React from "react";
import { Box, Stack } from "@mui/material";
import NulRevisionContainer from "../NulRevisionContainer";
import NulAlertBox from "../../components/NulAlertBox";
import { asyncAction } from "../../util/system/Promise";
import { net } from "../../util/net/Net";
import { HttpStatusCode } from "axios";
import { downloadFile } from "../../util/net/Download";
import { clearAuth } from "../../util/auth/Auth";
import { useNavigate } from "react-router-dom";

interface NulRealTimeEditorContext<T extends DataEntry> {
  id: number;
  data: T;
}

interface NulRealTimeEditorFrameworkProps<T extends DataEntry, R> {
  api: string;
  display?: (context: NulRealTimeEditorContext<T>) => ReactNode;
  revision: (context: NulRealTimeEditorContext<T>) => ReactNode;
  onChange: (context: NulRealTimeEditorContext<T>) => void;
  extractor: (data: T) => R;
}

const savePage = async <R,>(api: string, id: number, request: R) => {
  const result = await net.put({
    url: `/cleaner/${api}/${id}`,
    body: request
  });
  if (result.status !== HttpStatusCode.Ok) {
    throw new Error(result.data.message);
  }
};

const fetchTotal = async (api: string): Promise<number> => {
  const result = await net.get<number>({
    url: `/cleaner/${api}`
  });
  if (result.status !== HttpStatusCode.Ok) {
    throw new Error(result.data.message);
  }
  console.log(result);
  return result.data.result;
};

const loadPage = async <T extends DataEntry>(api: string, id: number): Promise<T> => {
  const result = await net.get<T>({
    url: `/cleaner/${api}/${id}`
  });
  if (result.status !== HttpStatusCode.Ok) {
    throw new Error(result.data.message);
  }
  return result.data.result;
};

const NulRealTimeEditorFramework = <T extends DataEntry, R>(props: NulRealTimeEditorFrameworkProps<T, R>): JSX.Element => {
  const { api, display, revision, extractor, onChange } = props;

  const navigate = useNavigate();

  const [id, setId] = React.useState<number>(0);
  const [data, setData] = React.useState<T | null>(null);
  const [total, setTotal] = React.useState<number>(0);
  const [totalLoaded, setTotalLoaded] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>('');

  const errorHandler = (err: unknown) => {
    if (err instanceof Error) {
      setErrorMessage(err.message);
    }
    setError(true);
    console.error(err);
  };

  const onPageChange = (page: number) => {
    asyncAction({
      action: async () => {
        if (!data) {
          throw new Error('Invalid data.');
        }
        const request = extractor(data);
        await savePage(api, id, request);
        setData(await loadPage<T>(api, page));
        setId(page);
        const pageData = await loadPage<T>(api, page);
        setData(pageData);
        onChange({ id: page, data: pageData });
      },
      catch: errorHandler
    });
  };

  const exportResult = () => {
    asyncAction({
      action: async () => {
        if (!data) {
          throw new Error('Invalid data.');
        }
        const request = extractor(data);
        await savePage(api, id, request);
        await downloadFile({
          url: `/cleaner/${api}/export`
        });
      },
      catch: errorHandler
    });
  };

  React.useEffect(() => {
    if (!totalLoaded) {
      asyncAction({
        action: async () => {
          const total = await fetchTotal(api);
          console.log(total);
          setTotal(total);
          const page = await loadPage<T>(api, 1);
          setId(1);
          setData(page);
          setTotalLoaded(true);
        },
        catch: errorHandler
      });
    }
  }, [totalLoaded]);

  return (
    <>
      <Stack direction='row' display='flex' width='100%' height='100%'>
        <NulRevisionContainer
          page={id}
          total={total}
          onChange={onPageChange}
          saveText='Export'
          onSave={exportResult}
          restoreText='Logout'
          onRestore={() => {
            clearAuth();
            navigate('/login');
          }}
        >
          {totalLoaded && data !== null && display && display({ id, data })}
        </NulRevisionContainer>
        <Box padding='20px' flexGrow={1} maxHeight='100%'>
          {totalLoaded && data !== null && revision({id, data})}
        </Box>
      </Stack>
      <NulAlertBox
        open={error}
        severity='warning'
        title='Error'
        message={errorMessage}
        onClose={() => {
          setError(false);
        }}
        autoHideDuration={2000}
      />
    </>
  );
};

export { NulRealTimeEditorFramework };
export type { NulRealTimeEditorContext };