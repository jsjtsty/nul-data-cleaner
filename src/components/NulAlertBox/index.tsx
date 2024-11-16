import { Box, Snackbar, SnackbarProps, styled, Typography } from '@mui/material';
import InfoIcon from '../../assets/alert-information.svg?react';
import WarningIcon from '../../assets/alert-warning.svg?react';
import SuccessIcon from '../../assets/alert-success.svg?react';
import './index.css';

interface AlertBoxProps extends SnackbarProps {
  severity?: 'info' | 'warning' | 'success';
  title: string;
  message: string;
}

const TitleTypography = styled(Typography)({
  fontFamily: 'Inter',
  fontWeight: 600,
  fontSize: '14px',
  lineHeight: '17px'
});

const MessageTypography = styled(Typography)({
  fontFamily: 'Inter',
  fontWeight: 400,
  fontSize: '14px',
  lineHeight: '17px',
  color: '#596A7C'
});

const NulAlertBox: React.FC<AlertBoxProps> = (props) => {

  const { severity = 'info', title, message } = props;

  const icons = {
    info: <InfoIcon />,
    warning: <WarningIcon />,
    success: <SuccessIcon />
  };

  return (
    <Snackbar
      className={`alert-box border-${severity} bg-${severity}`}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      {...props}
    >
      <Box className='alert-box-component'>
        <Box className='alert-box-icon'>
          {icons[severity]}
        </Box>
        <Box className='alert-box-content'>
          <TitleTypography className={`title-${severity}`}>
            {title}
          </TitleTypography>
          <MessageTypography>
            {message}
          </MessageTypography>
        </Box>
      </Box>
    </Snackbar>
  );
};

export default NulAlertBox;