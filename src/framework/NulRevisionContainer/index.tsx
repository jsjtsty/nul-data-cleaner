import { Box, Button, FormControl, InputLabel, MenuItem, Pagination, Select, Stack, TextField } from "@mui/material";
import React, { ReactNode } from "react";
import NulLinearProgress from "../../components/NulLinearProgress";
import NulProgressIndicator from "../../components/NulProgressIndicator";

interface NulCategory {
  id: number;
  name: string;
  description: string | null;
}

interface RevisionContainerProps {
  children?: ReactNode;
  total: number;
  page: number;
  onChange?: (page: number) => void;
  save?: boolean;
  saveText?: string;
  onSave?: () => void;
  restore?: boolean;
  restoreText?: string;
  onRestore?: () => void;
  category?: boolean;
  categoryId?: number;
  categoryOptions?: NulCategory[];
  onSwitchCategory?: (id: number) => void;
}

const NulRevisionContainer: React.FC<RevisionContainerProps> = (props) => {

  const {
    children, total, page, onChange,
    save = true, saveText = 'Save', onSave,
    restore = true, restoreText = 'Restore', onRestore,
    category = false, categoryOptions = [], categoryId, onSwitchCategory
  } = props;

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
        {restore &&
          <Button variant='outlined' onClick={onRestore}>
            {restoreText}
          </Button>
        }
        {save &&
          <Button variant='contained' onClick={onSave}>
            {saveText}
          </Button>
        }
        {category &&
          <Stack direction='row' spacing={1}>
            <FormControl fullWidth size='small'>
              <InputLabel>Category</InputLabel>
              <Select
                label='Category'
                value={categoryId}
                onChange={(event) => {
                  const raw = event.target.value;
                  const newValue = typeof raw === 'number' ? raw : parseInt(raw);
                  if (onSwitchCategory) {
                    onSwitchCategory(newValue);
                  }
                }}
                fullWidth
              >
                {categoryOptions.map(entry =>
                  <MenuItem value={entry.id}>{entry.name}</MenuItem>
                )}
              </Select>
            </FormControl>
          </Stack>
        }
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
    </Box >
  );
};

export default NulRevisionContainer;
export type { NulCategory };