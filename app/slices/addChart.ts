import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the Chart interface
export interface Chart {
  name: string;
  chartId: string;
  data: any; // Assuming data can be any type. You can adjust this to match your data structure.
}

// Define the state interface
interface ChartState {
  addChart: Chart[]; // Now an array of Chart
  loading: boolean;
  error: string | null;
}

// Initial state for the chart slice
const initialState: ChartState = {
  addChart: [], // Initialize as an empty array
  loading: false,
  error: null,
};

// Create an async thunk for adding a new chart via the API
export const addChart = createAsyncThunk<Chart, Chart>(
  'chart/addChart',
  async (newChart: any,{ rejectWithValue }) => {
    try {
      // Make a POST request to the /api/add-chart route
        const response = await axios.post('/api/add-chart', newChart, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
          },
        });
      return response.data; // Return the added chart
    } catch (error: any) {
      if (error.response?.status === 400) {
        // Handle 400 status (bad request)
        return rejectWithValue(error.response?.data?.error || 'Bad Request');
      }
      return rejectWithValue('Failed to add chart');
    }
  }
);

// Create the slice
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
        state.addChart.push(action.payload); // Add the new chart to the array
      })
      .addCase(addChart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to add chart';
      });
  },
});

export default chartSlice.reducer;
