import { createSlice } from '@reduxjs/toolkit';

// Function to retrieve user details from sessionStorage safely
export const getUserFromSessionStorage = () => {
  if (typeof window !== "undefined" && window.sessionStorage) {
    const userData: any = sessionStorage.getItem('user');
    return userData ? JSON.parse(window.atob(userData)) : null;
  }
  return null;
};

const initialState = {
  userDetails: null, // Initialize to null first
};

const userDetailsSlice = createSlice({
  name: 'userDetails',
  initialState,
  reducers: {
    setUser(state, action) {
      state.userDetails = action.payload;
      if (typeof window !== "undefined" && window.sessionStorage) {
        sessionStorage.setItem('user', JSON.stringify(action.payload)); // Save to sessionStorage
      }
    },
    clearUser(state) {
      state.userDetails = null;
      if (typeof window !== "undefined" && window.sessionStorage) {
        sessionStorage.removeItem('user'); // Remove from sessionStorage
      }
    },
    hydrateUser(state) {
      // Hydrate the user state after rendering on the client
      state.userDetails = getUserFromSessionStorage();
    },
  },
});

export const { setUser, clearUser, hydrateUser } = userDetailsSlice.actions;

export default userDetailsSlice.reducer;

// Selector to get user details from Redux store
export const selectUserDetails = (state: any) => state.userDetails.user;
