import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';


export interface Chart {
  name: string;
  chartId: string;
  data: any; 
}

interface ChartState {
  addChart: Chart[]; 
  loading: boolean;
  error: string | null;
}

const initialState: ChartState = {
  addChart: [], 
  loading: false,
  error: null,
};


export const addChart = createAsyncThunk<Chart, Chart>(
  'chart/addChart',
  async (newChart: any,{ rejectWithValue }) => {
    try {
     
        const response = await axios.post('/api/add-chart', newChart, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
          },
        });
      return response.data; 
    } catch (error: any) {
      if (error.response?.status === 400) {
      
        return rejectWithValue(error.response?.data?.error || 'Bad Request');
      }
      return rejectWithValue('Failed to add chart');
    }
  }
);

const chartSlice = createSlice({
  name: 'chart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addChart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addChart.fulfilled, (state, action: PayloadAction<Chart>) => {
        state.loading = false;
        state.addChart.push(action.payload); 
      })
      .addCase(addChart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to add chart';
      });
  },
});

export default chartSlice.reducer;
