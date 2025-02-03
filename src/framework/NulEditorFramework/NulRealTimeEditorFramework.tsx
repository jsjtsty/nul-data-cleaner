import { ReactNode } from "react";
import React from "react";
import { Box, Stack } from "@mui/material";
import NulRevisionContainer, { NulCategory } from "../NulRevisionContainer";
import NulAlertBox from "../../components/NulAlertBox";
import { asyncAction } from "../../util/system/Promise";
import { net } from "../../util/net/Net";
import { HttpStatusCode } from "axios";
import { downloadFile } from "../../util/net/Download";
import { clearAuth } from "../../util/auth/Auth";
import { useNavigate } from "react-router-dom";

interface NulRealTimeEditorContext<T> {
  id: number;
  data: T;
}

interface NulRealTimeEditorFrameworkProps<T, R> {
  api: string;
  display?: (context: NulRealTimeEditorContext<T>) => ReactNode;
  revision: (context: NulRealTimeEditorContext<T>) => ReactNode;
  onChange: (context: NulRealTimeEditorContext<T>) => void;
  extractor: (data: T) => R;
}

const loadCategoryList = async (api: string) => {
  const result = await net.get<NulCategory[]>({
    url: `/cleaner/${api}/category`
  });
  if (result.status !== HttpStatusCode.Ok) {
    throw new Error(result.data.message);
  }
  return result.data.result;
};

const savePage = async <R,>(api: string, category: number, id: number, request: R) => {
  const result = await net.put({
    url: `/cleaner/${api}/category/${category}/entry/${id}`,
    body: request
  });
  if (result.status !== HttpStatusCode.Ok) {
    throw new Error(result.data.message);
  }
};

const fetchTotal = async (api: string, category: number): Promise<number> => {
  const result = await net.get<number>({
    url: `/cleaner/${api}/category/${category}`
  });
  if (result.status !== HttpStatusCode.Ok) {
    throw new Error(result.data.message);
  }
  console.log(result);
  return result.data.result;
};

const loadPage = async <T,>(api: string, category: number, id: number): Promise<T> => {
  const result = await net.get<T>({
    url: `/cleaner/${api}/category/${category}/entry/${id}`
  });
  if (result.status !== HttpStatusCode.Ok) {
    throw new Error(result.data.message);
  }
  return result.data.result;
};

const NulRealTimeEditorFramework = <T, R>(props: NulRealTimeEditorFrameworkProps<T, R>): JSX.Element => {
  const { api, display, revision, extractor, onChange } = props;

  const navigate = useNavigate();

  const [id, setId] = React.useState<number>(0);
  const [category, setCategory] = React.useState<number>(0);
  const [categoryLoaded, setCategoryLoaded] = React.useState<boolean>(false);
  const [categoryList, setCategoryList] = React.useState<NulCategory[]>([]);
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
        await savePage(api, category, id, request);
        setData(await loadPage<T>(api, category, page));
        setId(page);
        const pageData = await loadPage<T>(api, category, page);
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
        await savePage(api, category, id, request);
        await downloadFile({
          url: `/cleaner/${api}/category/${category}/export`
        });
      },
      catch: errorHandler
    });
  };

  React.useEffect(() => {
    if (!categoryLoaded) {
      asyncAction({
        action: async () => {
          const categoryList = await loadCategoryList(api);
          categoryList.sort((entry) => entry.id);
          if (category === 0 && categoryList.length > 0) {
            setCategory(categoryList[0].id);
          }
          setCategoryList(categoryList);
          setCategoryLoaded(true);
          setTotalLoaded(false);
        }
      });
    } else {
      if (!totalLoaded) {
        asyncAction({
          action: async () => {
            const total = await fetchTotal(api, category);
            console.log(total);
            setTotal(total);
            const page = await loadPage<T>(api, category, 1);
            setId(1);
            setData(page);
            onChange({ id: 1, data: page });
            setTotalLoaded(true);
          },
          catch: errorHandler
        });
      }
    }
  }, [categoryLoaded, totalLoaded]);

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
          category={true}
          categoryId={category}
          categoryOptions={categoryList}
          onSwitchCategory={(targetCategory) => {
            if (!data) return;
            const formerId = structuredClone(id), formerCategory = structuredClone(category), request = extractor(data);
            asyncAction({
              action: async () => {
                await savePage(api, formerCategory, formerId, request);
              },
              catch: errorHandler
            });
            setCategory(targetCategory);
            setCategoryLoaded(false);
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