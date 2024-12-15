
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  user: [],
  userLoading: false,
  userError: null,
  addUserLoading: false,
  addUserError: null,
  addUserSuccess: false,
};

export const addUser = createAsyncThunk(
  'users/addUser',
  async (userData: { name: string; email: string; phone: string; password: string; role: number }) => {
    const response = await axios.post('/api/api/signup', userData); 
    return response.data;
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder

      .addCase(addUser.pending, (state) => {
        state.addUserLoading = true;
        state.addUserError = null;
        state.addUserSuccess = false;
      })
      .addCase(addUser.fulfilled, (state:any, action:any) => {
        state.addUserLoading = false;
        state.addUserSuccess = true;
        state.user =action.payload 
      })
      .addCase(addUser.rejected, (state:any, action:any) => {
        state.addUserLoading = false;
        state.addUserError = action.error.message;
        state.addUserSuccess = false;
      });
  },
});

export default userSlice.reducer;

