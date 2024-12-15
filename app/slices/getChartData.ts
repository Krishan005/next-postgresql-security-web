import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Chart {
  name: string;
  chartId: string;
  data: any; 
}

interface ChartState {
 
  chartData: Chart | null; 

  chartDataLoading: boolean; 

  chartDataError: string | null; 
}

const initialState: ChartState = {

  chartData: null,
  chartDataLoading: false,
  chartDataError: null,
};



export const getChartById = createAsyncThunk<
  Chart, 
  string, 
  { rejectValue: string } 
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
      return response.data; 
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to fetch chart data'
      );
    }
  }
);

const chartSlice = createSlice({
  name: 'charts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
   

      .addCase(getChartById.pending, (state) => {
        state.chartDataLoading = true;
        state.chartDataError = null;
        state.chartData = null; 
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
