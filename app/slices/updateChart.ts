import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';


export interface Chart {
  name: string;
  chartId: string;
  data: any; 
}

interface ChartState {
  editChart: Chart[]; 
  editloading: boolean;
  editerror: string | null;
}

const initialState: ChartState = {
  editChart: [],
  editloading: false,
  editerror: null,
};

export const updateChart = createAsyncThunk<Chart, Chart>(
  'chart/updateChart',
  async (updatedChart: Chart, { rejectWithValue }) => {
    try {

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
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {

        return rejectWithValue(error.response?.data?.error || 'Bad Request');
      }
      return rejectWithValue('Failed to update chart');
    }
  }
);


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
          state.editChart[index] = action.payload; 
        }
      })
      .addCase(updateChart.rejected, (state, action) => {
        state.editloading = false;
        state.editerror = action.payload as string || 'Failed to update chart';
      });
  },
});

export default chartSlice.reducer;
