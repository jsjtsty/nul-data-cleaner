import { Box, Button, Pagination, Stack } from "@mui/material";
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

  const {children, total, page, onChange, onSave, onRestore} = props;

  return (
    <Box height='100%'>
      <Stack spacing={2} minWidth='410px' padding='20px' display='flex'>
        <NulProgressIndicator value={page} total={total}/>
        <NulLinearProgress value={page * 100 / total}/>
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
        <Pagination count={total} page={page} color='primary' onChange={(_, value) => {
          if (onChange) onChange(value);
        }}/>
      </Stack>
    </Box>
  );
};

export default NulRevisionContainer;