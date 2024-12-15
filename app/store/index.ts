import { configureStore } from '@reduxjs/toolkit';
import chartReducer from '../slices/getCharts';  // Import your chart slice or reducers
import addChartsReducer from '../slices/addChart';  // Import your add chart slice or reducers
import getChartDataReducer from '../slices/getChartData';
import updateChartReducer from '../slices/updateChart';
import userReducer from '../slices/getUsers';
import addUsersReducer from '../slices/addUsers';
import editUsersReducer from '../slices/editUser';
import userDetailsReducer from '../slices/getUserDetails';

export const store = configureStore({
  reducer: {
        charts: chartReducer, 
        addChart: addChartsReducer,
        getChart: getChartDataReducer,
    updateChart: updateChartReducer,
    users: userReducer,
    addUser: addUsersReducer,
    editUser: editUsersReducer,
    userDetails: userDetailsReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
