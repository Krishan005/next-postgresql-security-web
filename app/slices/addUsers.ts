// src/features/users/getUsers.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the initial state for the users
const initialState = {
  user: [],
  userLoading: false,
  userError: null,
  addUserLoading: false,
  addUserError: null,
  addUserSuccess: false,
};

// Async thunk to add a new user
export const addUser = createAsyncThunk(
  'users/addUser',
  async (userData: { name: string; email: string; phone: string; password: string; role: number }) => {
    const response = await axios.post('/api/api/signup', userData); // Send POST request to the API
    return response.data;
  }
);

// Slice for managing user actions
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // You can define additional synchronous actions here if necessary
  },
  extraReducers: (builder) => {
    builder
      // Handle the addUser action
      .addCase(addUser.pending, (state) => {
        state.addUserLoading = true;
        state.addUserError = null;
        state.addUserSuccess = false;
      })
      .addCase(addUser.fulfilled, (state:any, action:any) => {
        state.addUserLoading = false;
        state.addUserSuccess = true;
        state.user =action.payload // Optionally, add the new user to the userList
      })
      .addCase(addUser.rejected, (state:any, action:any) => {
        state.addUserLoading = false;
        state.addUserError = action.error.message;
        state.addUserSuccess = false;
      });
  },
});

export default userSlice.reducer;

