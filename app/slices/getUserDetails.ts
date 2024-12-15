import { createSlice } from '@reduxjs/toolkit';


export const getUserFromSessionStorage = () => {
  if (typeof window !== "undefined" && window.sessionStorage) {
    const userData: any = sessionStorage.getItem('user');
    return userData ? JSON.parse(window.atob(userData)) : null;
  }
  return null;
};

const initialState = {
  userDetails: null,
};

const userDetailsSlice = createSlice({
  name: 'userDetails',
  initialState,
  reducers: {
    setUser(state, action) {
      state.userDetails = action.payload;
      if (typeof window !== "undefined" && window.sessionStorage) {
        sessionStorage.setItem('user', JSON.stringify(action.payload)); 
      }
    },
    clearUser(state) {
      state.userDetails = null;
      if (typeof window !== "undefined" && window.sessionStorage) {
        sessionStorage.removeItem('user'); 
      }
    },
    hydrateUser(state) {

      state.userDetails = getUserFromSessionStorage();
    },
  },
});

export const { setUser, clearUser, hydrateUser } = userDetailsSlice.actions;

export default userDetailsSlice.reducer;


export const selectUserDetails = (state: any) => state.userDetails.user;
