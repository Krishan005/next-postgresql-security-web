import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getUsers = createAsyncThunk(
  "users/getUsers",
  async (_, thunkAPI) => {
    try {
        const response = await axios.get("/api/get-users", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error:any) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : "An unexpected error occurred"
      );
    }
  }
);

const initialState = {
  userList: [],
  userLoading: false,
  userError: null,
};

// Slice
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.userLoading = true;
        state.userError = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.userLoading = false;
        state.userList = action.payload;
      })
      .addCase(getUsers.rejected, (state:any, action) => {
        state.userLoading = false;
        state.userError = action.payload || "Failed to fetch users.";
      });
  },
});

export default userSlice.reducer;
