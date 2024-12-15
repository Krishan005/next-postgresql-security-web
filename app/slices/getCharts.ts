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
  chartList: Chart[]; // This will hold all the charts
  chartloading: boolean;
  charterror: string | null;
}

// Initial state for the chart slice
const initialState: ChartState = {
  chartList: [], // Initialize with an empty array for chartList
  chartloading: false,
  charterror: null,
};

// Create an async thunk for fetching all charts from the API
export const getCharts:any = createAsyncThunk<any, void, { rejectValue: string }>(
  'chart/getCharts',
  async (_, { rejectWithValue }) => {
    try {
      // Make a GET request to the /api/get-charts route
      const response = await axios.get('/api/get-charts', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
      });
      return response.data; // Return the list of charts
    } catch (error: any) {
      if (error.response?.status === 400) {
        // Handle 400 status (bad request)
        return rejectWithValue(error.response?.data?.error || 'Bad Request');
      }
      return rejectWithValue('Failed to fetch charts');
    }
  }
)


// Create the slice
const chartSlice = createSlice({
  name: 'charts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCharts.pending, (state) => {
        state.chartloading = true;
        state.charterror = null;
      })
      .addCase(getCharts.fulfilled, (state, action: PayloadAction<Chart[]>) => {
        state.chartloading = false;
        state.chartList = action.payload; // Replace with the fetched charts
      })
      .addCase(getCharts.rejected, (state, action) => {
        state.chartloading = false;
        state.charterror = action.payload as string || 'Failed to fetch charts';
      });
  },
});

export default chartSlice.reducer;
