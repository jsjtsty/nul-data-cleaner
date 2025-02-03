import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import React from 'react';
import loginBackgroundUrl from '../../assets/login.svg';
import { selectLoggedIn, authActions, selectNavigated } from '../../action/Auth';
import { useAppDispatch, useAppSelector } from '../../action/hooks';
import { postGlobalAlert } from '../../action/GlobalAlert';
import '@fontsource/open-sans';
import { navigate } from '../../action/Router';

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const loggedIn = useAppSelector(selectLoggedIn);
  const navigated = useAppSelector(selectNavigated);

  const [username, setUserName] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  React.useEffect(() => {
    if (loggedIn) {
      if (!navigated) {
        // dispatch(authActions.navigate());
        navigate('/');
      }
    } else {
      dispatch(authActions.load());
    }
  }, [loggedIn]);

  const onLoginClick = () => {
    dispatch(authActions.login({ username, password }));
  };

  const onRegisterClick = () => {
    navigate('/register');
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
            height: '500px'
          }}
        >
          <Box sx={{
            fontFamily: 'Open Sans',
            fontWeight: 800,
            fontSize: '48px',
            lineHeight: '125%'
          }}>
            Log in
          </Box>
          <Box sx={{
            fontFamily: 'Open Sans',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: '18px',
            lineHeight: '125%',
            color: '#BCC5CF',
            marginTop: '32px'
          }}>
            Enter account information to continue.
          </Box>
          <Box sx={{
            fontFamily: 'Open Sans',
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: '18px',
            lineHeight: '125%',
            marginTop: '50px'
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
            display: 'flex',
            position: 'relative',
            marginTop: '33px',
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
            <Box
              sx={{
                fontFamily: 'Open Sans',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '125%',
                color: '#154AB6',
                paddingTop: '4px',
                order: 1
              }}
              onClick={() => {
                postGlobalAlert('Not Implemented', 'Pelease contact the developer to reset password.', 'warning');
              }}
            >
              Forgot password?
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
          <Stack 
            marginTop='70px'
            spacing={2}
          >
            <Button variant='outlined' fullWidth={true} disableElevation
              onClick={onRegisterClick}
            >
              Register
            </Button>
            <Button variant='contained' fullWidth={true} disableElevation sx={{
              backgroundColor: '#0052CC',
            }}
              onClick={onLoginClick}
            >
              Login
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

export { LoginPage };