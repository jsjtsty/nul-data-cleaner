import { createAsyncThunk, createSlice, isRejected } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { net } from "../util/net/Net";

// 1. Requests.

interface RegisterRequest {
  username: string;
  name: string;
  password: string;
  inviteCode: string;
}

// 2. Responses.

type LoginResponse = string;

// 3. Params for reducers.

interface LoginParams {
  username: string;
  password: string;
}

interface RegisterParams {
  username: string;
  name: string;
  password: string;
  inviteCode: string;
}

// 4. State and initial value definition.

interface AuthState {
  loggedIn: boolean;
  loadFailed: boolean;
  registerSuccess: boolean;
  navigated: boolean;
  token: string;
}

const initialState: AuthState = {
  loggedIn: false,
  loadFailed: false,
  registerSuccess: false,
  navigated: false,
  token: ''
};

// 5. Async functions definition.

const login = createAsyncThunk('api/login', async (params: LoginParams) => {
  const response = await net.get<LoginResponse>({
    url: '/account/login',
    params: {
      username: params.username,
      password: params.password
    },
    token: false
  });
  localStorage.setItem('token', response.data.result.split(' ')[1]);
  return response.data;
});

const register = createAsyncThunk('api/register', async (params: RegisterParams) => {
  const response = await net.post<null, RegisterRequest>({
    url: '/account',
    body: {
      username: params.username,
      password: params.password,
      name: params.name,
      inviteCode: params.inviteCode
    },
    token: false
  });
  return response.data;
});

// 6. Slice definition.

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    clear: (state) => {
      state.loggedIn = false;
      state.token = '';
      state.registerSuccess = false;
      localStorage.removeItem('token');
    },
    clearRegisterState: (state) => {
      state.registerSuccess = false;
    },
    load: (state) => {
      const token = localStorage.getItem('token');
      if (token !== null) {
        state.token = token;
        state.loggedIn = true;
      }
    },
    navigate: (state) => {
      state.navigated = true;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      const token = action.payload.result.split(' ')[1];
      state.token = token;
      state.loggedIn = true;
    }).addCase(register.fulfilled, (state) => {
      state.registerSuccess = true;
    }).addMatcher(isRejected, (_state, action) => {
      console.log(action.error);
    });
  }
});

export default authSlice.reducer;
export const authActions = { ...authSlice.actions, login, register };
export const selectLoggedIn = (root: RootState) => root.authReducer.loggedIn;
export const selectAuthLoadFailed = (root: RootState) => root.authReducer.loadFailed;
export const selectToken = (root: RootState) => root.authReducer.token;
export const selectRegisterSuccess = (root: RootState) => root.authReducer.registerSuccess;
export const selectNavigated = (root: RootState) => root.authReducer.navigated;