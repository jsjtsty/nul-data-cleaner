import { styled } from '@mui/material/styles';
import { LinearProgressProps, Box, Typography } from "@mui/material";
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[800],
    }),
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: '#1a90ff',
    ...theme.applyStyles('dark', {
      backgroundColor: '#308fe8',
    }),
  },
}));

const NulLinearProgress = (props: LinearProgressProps) => {
  return (
    <Box display='flex' alignItems='center' padding='4px 2px 4px 2px'>
      <Box flexGrow={1} mr={1}>
        <BorderLinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography
          variant='body2'
          color='text.secondary'
        >
          {`${(props.value ?? 100).toFixed(2)}%`}
        </Typography>
      </Box>
    </Box>
  );
};

export default NulLinearProgress;