import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


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
    
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);


const editUsersSlice = createSlice({
  name: 'editUsers',
  initialState: {
    userUpdate: null, 
    status: 'idle',
    error: null, 
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
        state.userUpdate = action.payload; 
        state.error = null;
      })
      .addCase(updateUser.rejected, (state:any, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to update user';
      });
  },
});

export default editUsersSlice.reducer;
