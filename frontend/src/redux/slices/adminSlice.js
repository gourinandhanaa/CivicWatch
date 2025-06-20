import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// 📊 Fetch admin dashboard statistics
export const fetchAdminStats = createAsyncThunk(
  'admin/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/stats');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch admin stats');
    }
  }
);

// 📥 Fetch all reports
export const fetchAllReports = createAsyncThunk(
  'admin/fetchAllReports',
  async ({ keyword = '', page = 1 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/issue?keyword=${keyword}&page=${page}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reports');
    }
  }
);

// ✅ Admin: Fetch a single issue by ID
export const getSingleIssue = createAsyncThunk(
  'admin/getSingleIssue',
  async (issueId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/issue/admin/${issueId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch issue details');
    }
  }
);

// ✅ Admin: Update issue status
export const updateIssue = createAsyncThunk(
  'admin/updateIssue',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/issue/admin/${id}`, { status });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update issue');
    }
  }
);

// ✅ Admin: Fetch all users
export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/users');
      return response.data.users;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

// ✅ Admin: Get user details
export const getUserDetails = createAsyncThunk(
  'admin/getUserDetails',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user details');
    }
  }
);

// ✅ Admin: Create new user
export const createUser = createAsyncThunk(
  'admin/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/admin/users', userData);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create user');
    }
  }
);

// ✅ Admin: Update user
export const updateUser = createAsyncThunk(
  'admin/updateUser',
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/users/${userId}`, userData);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

// ✅ Admin: Promote user to admin
export const promoteUserToAdmin = createAsyncThunk(
  'admin/promoteUserToAdmin',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/users/${userId}/promote`);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to promote user');
    }
  }
);

// ✅ Admin: Delete user
export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/users/${userId}`);
      return userId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);

// 🔧 Slice
const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    adminData: null,
    stats: {
      users: 0,
      reports: 0,
      pendingReports: 0,
      resolvedReports: 0,
      newUsersThisWeek: 0,
      resolutionRate: 0,
      reportsTrend: 0,
      pendingTrend: 0,
      resolutionTrend: 0,
      recentUsers: [],
      recentReports: []
    },
    reports: [],
    users: [],
    userDetails: null,
    count: 0,
    loading: false,
    error: null
  },
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
    clearUserDetails: (state) => {
      state.userDetails = null;
    }
  },
  extraReducers: (builder) => {
    builder

      // 📊 Admin Stats
      .addCase(fetchAdminStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.loading = false;
        state.adminData = action.payload.admin;
        state.stats = { ...state.stats, ...action.payload.stats };
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📥 All Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📥 All Reports
      .addCase(fetchAllReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload.reports;
        state.count = action.payload.count;
      })
      .addCase(fetchAllReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📄 Get Single Issue
      .addCase(getSingleIssue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSingleIssue.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.reports.findIndex(r => r._id === action.payload._id);
        if (idx !== -1) {
          state.reports[idx] = action.payload;
        } else {
          state.reports.push(action.payload);
        }
      })
      .addCase(getSingleIssue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🛠️ Update Issue
      .addCase(updateIssue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateIssue.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.reports.findIndex(r => r._id === action.payload._id);
        if (idx !== -1) {
          state.reports[idx] = action.payload;
        }
      })
      .addCase(updateIssue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearAdminError, clearUserDetails } = adminSlice.actions;
export default adminSlice.reducer;
