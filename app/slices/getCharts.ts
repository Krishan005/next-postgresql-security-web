import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Chart {
  name: string;
  chartId: string;
  data: any; 
}

interface ChartState {
  chartList: Chart[];
  newchatsList: [],
  chartloading: boolean;
  charterror: string | null;
}


const initialState: ChartState = {
  chartList: [], 
  newchatsList: [],

  chartloading: false,
  charterror: null,
};

export const getCharts:any = createAsyncThunk<any, void, { rejectValue: string }>(
  'chart/getCharts',
  async (_, { rejectWithValue }) => {
    try {
     
      const response = await axios.get('/api/get-charts', {
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
      return rejectWithValue('Failed to fetch charts');
    }
  }
)



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
      .addCase(getCharts.fulfilled, (state:any, action: PayloadAction<Chart[]>) => {
        state.chartloading = false;
        state.chartList = action.payload;
        state.newchatsList = JSON.parse(Buffer.from(state.chartList?.charts, 'base64').toString('utf-8'));
      })
      .addCase(getCharts.rejected, (state, action) => {
        state.chartloading = false;
        state.charterror = action.payload as string || 'Failed to fetch charts';
      });
  },
});

export default chartSlice.reducer;
