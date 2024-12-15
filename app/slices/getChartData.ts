import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the Chart interface
export interface Chart {
  name: string;
  chartId: string;
  data: any; // Adjust this type based on your data structure
}

// Define the state interface
interface ChartState {
 
  chartData: Chart | null; // Single chart data (fetched by ID)

  chartDataLoading: boolean; // Loading state for single chart

  chartDataError: string | null; // Error state for single chart
}

// Initial state for the chart slice
const initialState: ChartState = {

  chartData: null,
  chartDataLoading: false,
  chartDataError: null,
};


// Create an async thunk for fetching a single chart by ID
export const getChartById = createAsyncThunk<
  Chart, // Return type
  string, // Argument type (chart ID)
  { rejectValue: string } // ThunkAPI reject value type
>(
  'chart/getChartById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/get-chart-data/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      });
      return response.data; // Assuming the API returns { chart: {...} }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to fetch chart data'
      );
    }
  }
);

// Create the slice
const chartSlice = createSlice({
  name: 'charts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
   
      // Handling getChartById
      .addCase(getChartById.pending, (state) => {
        state.chartDataLoading = true;
        state.chartDataError = null;
        state.chartData = null; // Reset chart data during loading
      })
      .addCase(getChartById.fulfilled, (state, action: PayloadAction<Chart>) => {
        state.chartDataLoading = false;
        state.chartData = action.payload;
      })
      .addCase(getChartById.rejected, (state, action) => {
        state.chartDataLoading = false;
        state.chartDataError = action.payload || 'Failed to fetch chart data';
      });
  },
});

export default chartSlice.reducer;
