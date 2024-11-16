import { Box, Typography } from '@mui/material';

interface NulProgressIndicatorProps {
  value: number;
  total: number;
}

const NulProgressIndicator: React.FC<NulProgressIndicatorProps> = (props) => {

  const { value, total } = props;

  return (
    <Box
      display="flex"
      justifyContent="center"
      padding="30px"
    >
      <Box
        height='200px'
        width='200px'
        display='flex'
        alignItems='center'
        justifyContent='center'
        borderRadius='50%'
        boxShadow='0px 4px 10px rgba(0, 0, 0, 0.2)'
        border='3px solid #00BFFF'
        flexDirection='column'
      >
        <Typography variant='h2'>{value}</Typography>
        Total {total}
      </Box>
    </Box>
  );
};

export default NulProgressIndicator;