import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from "@mui/material";
import React from "react";
import { navigate } from "../../action/Router";

interface Option {
  id: string;
  name: string;
  route: string;
}

const routeList: Option[] = [
  {
    id: 'image-benchmark',
    name: 'Image Benchmark',
    route: '/image-benchmark'
  },
  {
    id: 'problem-solution',
    name: 'Problem Solution',
    route: '/problem-solution'
  },
  {
    id: 'image-problem-solution',
    name: 'Multimodal Problem Solution',
    route: '/image-problem'
  },
  {
    id: 'multiple',
    name: 'Multi-turn Conversation (Legacy UI)',
    route: '/multiple'
  },
  {
    id: 'problems',
    name: 'Problems Annotation (Legacy UI)',
    route: '/problems'
  }
];

const routeMap = new Map<string, Option>();
for (const route of routeList) {
  routeMap.set(route.id, route);
}

const SelectionPage: React.FC = () => {

  const [selected, setSelected] = React.useState<string>('');
  const [checked, setChecked] = React.useState<boolean>(false);

  const onNavigate = () => {
    const item = routeMap.get(selected);
    if (!item) return;
    navigate(item.route);
  }

  React.useEffect(() => {
    if (!checked) {
      setChecked(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
      }
    }
  }, [checked]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Stack width='400px' spacing={3}>
        <Typography width='100%' align='center' fontSize='36px' fontFamily='Open Sans' fontWeight={600}>
          Menu
        </Typography>
        <FormControl fullWidth>
          <InputLabel>Function</InputLabel>
          <Select
            label='Function'
            value={selected}
            onChange={(event) => setSelected(event.target.value)}
          >
            {routeList.map(entry =>
              <MenuItem value={entry.id}>{entry.name}</MenuItem>
            )}
          </Select>
        </FormControl>
        <Button variant='contained' fullWidth disableElevation onClick={onNavigate}>
          GO
        </Button>
      </Stack>
    </Box>
  );
};

export { SelectionPage };