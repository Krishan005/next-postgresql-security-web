import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for updating a user
export const updateUser:any = createAsyncThunk(
  'users/updateUser',
  async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.patch('/api/update-user', userData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error:any) {
      // Return a rejected value for error handling in the slice
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

// Slice for managing user updates
const editUsersSlice = createSlice({
  name: 'editUsers',
  initialState: {
    userUpdate: null, // User being updated
    status: 'idle', // idle | loading | succeeded | failed
    error: null, // Error message
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userUpdate = action.payload; // Update the user in the state
        state.error = null;
      })
      .addCase(updateUser.rejected, (state:any, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to update user';
      });
  },
});

export default editUsersSlice.reducer;
