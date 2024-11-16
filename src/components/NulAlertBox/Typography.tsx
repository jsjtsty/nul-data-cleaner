import styled from "@emotion/styled";
import { Typography } from "@mui/material";

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

export { TitleTypography, MessageTypography };