import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import React from 'react';
import loginBackgroundUrl from '../../assets/login.svg';
import { useNavigate } from 'react-router-dom';
import { authActions, selectRegisterSuccess } from '../../action/Auth';
import { useAppDispatch, useAppSelector } from '../../action/hooks';
import { postGlobalAlert } from '../../action/GlobalAlert';
import '@fontsource/open-sans';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const registerSuccess = useAppSelector(selectRegisterSuccess);

  const [username, setUserName] = React.useState<string>('');
  const [name, setName] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [inviteCode, setInvideCode] = React.useState<string>('');

  React.useEffect(() => {
    if (registerSuccess) {
      postGlobalAlert('Register Success', 'Please log in using your credencials.', 'success');
      dispatch(authActions.clearRegisterState());
      navigate('/login');
    }
  }, [registerSuccess]);

  const onLoginClick = () => {
    navigate('/login');
  };

  const onRegisterClick = () => {
    dispatch(authActions.register({ username, name, password, inviteCode }));
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'row'
    }}>
      <Box sx={{
        width: '45%',
        height: '100vh',
        display: 'flex',
        color: '#154AB6',
        backgroundImage: `url(${loginBackgroundUrl})`
      }}>
        <Stack spacing={2} marginLeft='13%' marginTop='30%'>
          <Typography fontFamily='Microsoft YaHei' fontSize='24px' fontWeight={600}>Welcome to</Typography>
          <Box>
            <Typography fontFamily='Microsoft YaHei' fontSize='48px' lineHeight={1.27} fontWeight={800}>WI Data</Typography>
            <Typography fontFamily='Microsoft YaHei' fontSize='48px' lineHeight={1.27} fontWeight={800}>Process Platform</Typography>
          </Box>
        </Stack>
      </Box>
      <Box sx={{
        flexGrow: 1,
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Box
          sx={{
            width: '400px',
            height: '650px'
          }}
        >
          <Box sx={{
            fontFamily: 'Open Sans',
            fontWeight: 800,
            fontSize: '48px',
            lineHeight: '125%'
          }}>
            Register
          </Box>
          <Box sx={{
            fontFamily: 'Open Sans',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: '18px',
            lineHeight: '125%',
            color: '#BCC5CF',
            marginTop: '24px'
          }}>
            Create a new account using invite code.
          </Box>
          <Box sx={{
            fontFamily: 'Open Sans',
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: '18px',
            lineHeight: '125%',
            marginTop: '34px'
          }}>
            User Name
          </Box>
          <Box sx={{
            marginTop: '12px'
          }}>
            <TextField
              placeholder='User Name' fullWidth={true} size='small'
              value={username} onChange={(action) => setUserName(action.target.value)}
            />
          </Box>
          <Box sx={{
            fontFamily: 'Open Sans',
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: '18px',
            lineHeight: '125%',
            marginTop: '22px'
          }}>
            Name
          </Box>
          <Box sx={{
            marginTop: '12px'
          }}>
            <TextField
              placeholder='Name' fullWidth={true} size='small'
              value={name} onChange={(action) => setName(action.target.value)}
            />
          </Box>
          <Box sx={{
            display: 'flex',
            position: 'relative',
            marginTop: '22px',
            justifyContent: 'space-between'
          }}>
            <Box sx={{
              fontFamily: 'Open Sans',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '18px',
              lineHeight: '125%',
              order: 0
            }}>
              Password
            </Box>
          </Box>
          <Box sx={{
            marginTop: '12px'
          }}>
            <TextField
              type='password' placeholder='Password'
              value={password} onChange={(action) => setPassword(action.target.value)}
              fullWidth={true} size='small'
            />
          </Box>
          <Box sx={{
            fontFamily: 'Open Sans',
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: '18px',
            lineHeight: '125%',
            marginTop: '22px'
          }}>
            Invite Code
          </Box>
          <Box sx={{
            marginTop: '12px'
          }}>
            <TextField
              placeholder='Invite Code' fullWidth={true} size='small'
              value={inviteCode} onChange={(action) => setInvideCode(action.target.value)}
            />
          </Box>
          <Stack
            marginTop='40px'
            spacing={2}
          >
            <Button variant='outlined' fullWidth={true} disableElevation
              onClick={onLoginClick}
            >
              Login
            </Button>
            <Button variant='contained' fullWidth={true} disableElevation sx={{
              backgroundColor: '#0052CC',
            }}
              onClick={onRegisterClick}
            >
              Register
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

export { RegisterPage };