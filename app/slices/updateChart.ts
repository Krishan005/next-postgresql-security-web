import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the Chart interface
export interface Chart {
  name: string;
  chartId: string;
  data: any; // Adjust this to match your data structure
}

// Define the state interface
interface ChartState {
  editChart: Chart[]; // Array of Chart objects
  editloading: boolean;
  editerror: string | null;
}

// Initial state for the chart slice
const initialState: ChartState = {
  editChart: [],
  editloading: false,
  editerror: null,
};

// Create an async thunk for updating chart data
export const updateChart = createAsyncThunk<Chart, Chart>(
  'chart/updateChart',
  async (updatedChart: Chart, { rejectWithValue }) => {
    try {
      // Make a PUT request to the /api/get-update-chart-data route
      const response = await axios.put(
        `/api/get-update-chart-data`,
        updatedChart,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
          },
        }
      );
      return response.data; // Return the updated chart
    } catch (error: any) {
      if (error.response?.status === 400) {
        // Handle 400 status (bad request)
        return rejectWithValue(error.response?.data?.error || 'Bad Request');
      }
      return rejectWithValue('Failed to update chart');
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
      .addCase(updateChart.pending, (state) => {
        state.editloading = true;
        state.editerror = null;
      })
      .addCase(updateChart.fulfilled, (state, action: PayloadAction<Chart>) => {
        state.editloading = false;
        const index = state.editChart.findIndex(chart => chart.chartId === action.payload.chartId);
        if (index !== -1) {
          state.editChart[index] = action.payload; // Update the existing chart in the array
        }
      })
      .addCase(updateChart.rejected, (state, action) => {
        state.editloading = false;
        state.editerror = action.payload as string || 'Failed to update chart';
      });
  },
});

export default chartSlice.reducer;
