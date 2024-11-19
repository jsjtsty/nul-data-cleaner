import { Box, Button, Pagination, Stack, TextField } from "@mui/material";
import React, { ReactNode } from "react";
import NulLinearProgress from "../../components/NulLinearProgress";
import NulProgressIndicator from "../../components/NulProgressIndicator";

interface RevisionContainerProps {
  children?: ReactNode;
  total: number;
  page: number;
  onChange?: (page: number) => void;
  onSave?: () => void;
  onRestore?: () => void;
}

const NulRevisionContainer: React.FC<RevisionContainerProps> = (props) => {

  const { children, total, page, onChange, onSave, onRestore } = props;

  const [pageNavigate, setPageNavigate] = React.useState<string>('');
  const [pageNavigateError, setPageNavigateError] = React.useState<boolean>(false);

  React.useEffect(() => {
    setPageNavigate(`${page}`);
    setPageNavigateError(false);
  }, [page]);

  return (
    <Box height='100%'>
      <Stack spacing={2} minWidth='410px' padding='20px' display='flex'>
        <NulProgressIndicator value={page} total={total} />
        <NulLinearProgress value={page * 100 / total} />
        {children && (
          <Box flexGrow={1}>
            {children}
          </Box>
        )}
        <Button variant='outlined' onClick={onRestore}>
          Reset
        </Button>
        <Button variant='contained' onClick={onSave}>
          Save
        </Button>
        <Stack direction='row' spacing={1}>
          <TextField
            id='outlined-number'
            label='Page'
            type='number'
            size='small'
            error={pageNavigateError}
            value={pageNavigate}
            onChange={(event) => {
              const svalue = event.target.value.trim();
              setPageNavigate(svalue);
            }}
            slotProps={{
              htmlInput: {
                min: 1,
                max: total
              }
            }}
            fullWidth
          />
          <Button
            variant='outlined'
            size='small'
            onClick={() => {
              if (onChange) {
                const value = parseInt(pageNavigate);
                if (isNaN(value) || value <= 0 || value > total) {
                  setPageNavigateError(true);
                  return;
                }
                onChange(value);
              }
            }}
          >
            GO
          </Button>
        </Stack>
        <Pagination count={total} page={page} color='primary' onChange={(_, value) => {
          if (onChange) onChange(value);
        }} />
      </Stack>
    </Box>
  );
};

export default NulRevisionContainer;