import { Box, Button, InputAdornment, Stack, Tab, Tabs, TextareaAutosize, TextField, Typography } from "@mui/material";
import { NulEditorFramework, NulEditorContext } from "../../framework/NulEditorFramework/NulEditorFramework.tsx";
import { AgricultureMultipleDataEntry, AgricultureMultipleParser } from "../../util/parsers/AgricultureMultipleParser";
import React from 'react';
import NulTextDifference from "../../components/NulTextDifference";
import SearchIcon from '@mui/icons-material/Search';
import { useAppDispatch, useAppSelector } from '../../action/hooks.ts';
import { agricultureMultipleActions, agricultureMultipleSelectors } from '../../action/AgricultureMultiple.ts';

const AgricultureMultipleReviser: React.FC = () => {

  type TabIndex = 'dialog' | 'knowledge' | 'search';

  const [ id, setId ] = React.useState<number>(0);
  const [ dialog, setDialog ] = React.useState<string>('');
  const [ knowledge, setKnowledge ] = React.useState<string>('');
  const [ tabIndex, setTabIndex ] = React.useState<TabIndex>('dialog');
  const [ searchText, setSearchText ] = React.useState<string>('');

  const searchResult = useAppSelector(agricultureMultipleSelectors.selectKnowledge);

  const dispatch = useAppDispatch();

  const search = () => {
    dispatch(agricultureMultipleActions.searchKnowledge({
      keywords: searchText.split(/[,，;；]+/)
    }));
  };

  const revision = (context: NulEditorContext<AgricultureMultipleDataEntry>) => {

    const originDialogText = context.origin[context.id].dialog.join('\n');
    const originKnowledgeText = context.origin[context.id].knowledge.join('\n');

    const tabContents = {
      dialog: (
        <Stack display='flex' direction='row' spacing={2} maxHeight='100%'>
          <Box border='1px solid #ccc' borderRadius='4px' padding='12px' flexBasis='50%' flexGrow={1} maxHeight='100%' display='flex'>
            <Box sx={{overflowY: 'auto', height: '100%'}}>
              <NulTextDifference compare={context.id === id} reference={originDialogText} text={dialog}/>
            </Box>
          </Box>
          <Box flexBasis='50%' flexGrow={1} display='block'>
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <TextareaAutosize
                minRows={3}
                value={dialog}
                onChange={(event) => setDialog(event.target.value)}
                style={{
                  height: '100%',
                  width: '100%',
                  resize: 'none',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid rgba(0, 0, 0, 0.23)',
                  fontSize: '1rem',
                  lineHeight: 1.5,
                  fontFamily: 'Roboto,Helvetica,Arial,sans-serif',
                  color: '#213547',
                  letterSpacing: '0.00938em',
                  boxSizing: 'border-box',
                  overflow: 'auto',
                }}
              />
            </Box>
          </Box>
        </Stack>
      ),
      knowledge: (
        <Stack display='flex' direction='row' spacing={2} maxHeight='100%'>
          <Box border='1px solid #ccc' borderRadius='4px' padding='12px' flexBasis='50%' flexGrow={1} maxHeight='100%' display='flex'>
            <Box sx={{overflowY: 'auto', flex: 1}}>
              <NulTextDifference compare={context.id === id} reference={originKnowledgeText} text={knowledge}/>
            </Box>
          </Box>
          <Box flexBasis='50%' flexGrow={1} display='block'>
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <TextareaAutosize
                minRows={3}
                value={knowledge}
                onChange={(event) => setKnowledge(event.target.value)}
                style={{
                  height: '100%',
                  width: '100%',
                  resize: 'none',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid rgba(0, 0, 0, 0.23)',
                  fontSize: '1rem',
                  lineHeight: 1.5,
                  fontFamily: 'Roboto,Helvetica,Arial,sans-serif',
                  color: '#213547',
                  letterSpacing: '0.00938em',
                  boxSizing: 'border-box',
                  overflow: 'auto',
                }}
              />
            </Box>
          </Box>
        </Stack>
      ),
      search: (
        <Stack width='100%' spacing={2} display='flex'>
          <Stack spacing={2} direction='row' display='flex'>
            <Box flexGrow={1}>
              <TextField
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                label='Search'
                fullWidth
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon/>
                      </InputAdornment>
                    )
                  }
                }}
              />
            </Box>
            <Button
              variant='contained'
              onClick={search}
              sx={{ width: '120px', textTransform: 'none' }}
            >
              Submit
            </Button>
          </Stack>
          <Stack overflow='auto'>
            {searchResult.map((item) =>
              <p>
                <Typography>{item}</Typography>
              </p>
            )}
          </Stack>
        </Stack>
      )
    };

    return (
      <Stack width='100%' height='100%' display='flex' maxHeight='100%' overflow='hidden'>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabIndex} onChange={(_, newValue) => setTabIndex(newValue)}>
            <Tab label='Dialog' value='dialog' />
            <Tab label='Knowledge' value='knowledge' />
            <Tab label='Search' value='search' />
          </Tabs>
        </Box>
        <Stack direction='row' display='flex' paddingTop='20px' flex={1} overflow='hidden'>
          {tabContents[tabIndex]}
        </Stack>
      </Stack>
    );
  };

  return (
    <NulEditorFramework<AgricultureMultipleDataEntry>
      parser={new AgricultureMultipleParser()}
      store='test'
      revision={revision}
      extractor={(data) => {
        return {
          ...data,
          dialog: dialog.split('\n').map(val => val.trim()).filter(val => val !== ''),
          knowledge: knowledge.split('\n').map(val => val.trim()).filter(val => val !== '')
        };
      }}
      onChange={(context) => {
        setId(context.id);
        setDialog(context.data[context.id].dialog.join('\n'));
        setKnowledge(context.data[context.id].knowledge.join('\n'));
      }}
      onRestore={(origin) => {
        setDialog(origin.dialog.join('\n'));
        setKnowledge(origin.knowledge.join('\n'));
      }}
    />
  );
};

export { AgricultureMultipleReviser };