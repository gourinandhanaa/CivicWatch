import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ✅ Thunk: Fetch user stats
export const fetchUserStats = createAsyncThunk(
  'user/fetchUserStats',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/issue/user/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      return response.data.stats;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

// ✅ Thunk: Fetch user reports
export const fetchMyReports = createAsyncThunk(
  'user/fetchMyReports',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/issue/my-reports`, {
        withCredentials: true,
      });
      return data.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to load your reports');
    }
  }
);

// ✅ Thunk: Create new report (with image upload)
export const createNewReport = createAsyncThunk(
  'user/createNewReport',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/issue/new`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }
      );
      return data;
    } catch (error) {
      console.error('🔥 Backend error response:', error?.response?.data);
      return rejectWithValue(error?.response?.data?.message || 'Report submission failed');
    }
  }
);
export const deleteReport = createAsyncThunk(
  'user/deleteReport',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`${process.env.REACT_APP_API_URL}/issue/${id}`, {
        withCredentials: true,
        data: {}, // ✅ needed to include cookies in DELETE
      });
      return data.message;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to delete report');
    }
  }
);




// ✅ Initial State
const initialState = {
  stats: {
    reportsSubmitted: 0,
    reportsPending: 0,
    reportsResolved: 0,
  },
  myReports: [],
  loading: false,
  error: null,
};

// ✅ Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserData: (state) => {
      state.stats = {
        reportsSubmitted: 0,
        reportsPending: 0,
        reportsResolved: 0,
      };
      state.myReports = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🟦 User Stats
      .addCase(fetchUserStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🟩 My Reports
      .addCase(fetchMyReports.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyReports.fulfilled, (state, action) => {
        state.loading = false;
        state.myReports = action.payload;
      })
      .addCase(fetchMyReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🟥 New Report Submission
      .addCase(createNewReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewReport.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createNewReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// ✅ Exports
export const { clearUserData } = userSlice.actions;
export default userSlice.reducer;
