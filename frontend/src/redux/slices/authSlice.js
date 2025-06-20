import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAuthToken } from '../../utils/axiosConfig';

// 🔹 Helper to extract error messages
const handleAuthError = (error) => {
  const message =
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    'Authentication failed';
  return message;
};

// 🔐 LOGIN
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        { email, password },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      if (data.token) setAuthToken(data.token);
      return {
        token: data.token,
        user: data.user,
        message: 'Login successful',
      };
    } catch (error) {
      return rejectWithValue(handleAuthError(error));
    }
  }
);

// 📝 REGISTER
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/register`,
        { name, email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      return { message: data.message || 'Registration successful' };
    } catch (error) {
      return rejectWithValue(handleAuthError(error));
    }
  }
);

// 👤 LOAD USER
export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      if (!token) return rejectWithValue('No authentication token found');
      setAuthToken(token);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/auth/me`,
        { withCredentials: true }
      );
      return {
        user: data.user,
        role: data.user.role,
      };
    } catch (error) {
      return rejectWithValue(handleAuthError(error));
    }
  }
);

// 🔓 LOGOUT
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { dispatch }) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/logout`);
    } finally {
      dispatch(authSlice.actions.clearAuth());
      setAuthToken(null);
    }
  }
);

// 📩 FORGOT PASSWORD
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/forgot-password`,
        { email },
        { headers: { 'Content-Type': 'application/json' } }
      );
      return { message: data.message };
    } catch (error) {
      return rejectWithValue(handleAuthError(error));
    }
  }
);

// 🔁 RESEND VERIFICATION EMAIL
export const resendVerificationEmail = createAsyncThunk(
  'auth/resendVerificationEmail',
  async (email, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/resend-verification`,
        { email },
        { headers: { 'Content-Type': 'application/json' } }
      );
      return { message: data.message };
    } catch (error) {
      return rejectWithValue(handleAuthError(error));
    }
  }
);

// ✏️ UPDATE PROFILE
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (formData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/auth/update-profile`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update profile'
      );
    }
  }
);

// 🖼️ UPLOAD AVATAR
export const uploadAvatar = createAsyncThunk(
  'auth/uploadAvatar',
  async (avatarFile, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/auth/upload-avatar`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload avatar');
    }
  }
);

// ✅ CHANGE PASSWORD
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ oldPassword, newPassword }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const { data } = await axios.put(
        `${process.env.REACT_APP_API_URL}/auth/password/change`,
        { oldPassword, newPassword },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data.message;
    } catch (error) {
      return rejectWithValue(handleAuthError(error));
    }
  }
);

// 🧾 INITIAL STATE
const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  message: null,
  role: localStorage.getItem('role') || null,
};

// 🧩 SLICE
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.role = null;
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.token = payload.token;
        state.user = payload.user;
        state.isAuthenticated = true;
        state.role = payload.user.role;
        state.message = payload.message;
        localStorage.setItem('token', payload.token);
        localStorage.setItem('role', payload.user.role);
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        state.isAuthenticated = false;
      })

      // register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.message = payload.message;
      })
      .addCase(registerUser.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })

      // load user
      .addCase(loadUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload.user;
        state.isAuthenticated = true;
        state.role = payload.role;
      })
      .addCase(loadUser.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        const authErrors = ['Unauthorized', 'jwt expired', 'Token expired', 'No authentication token found'];
        if (authErrors.some((err) => payload?.includes?.(err))) {
          state.isAuthenticated = false;
          state.token = null;
          state.user = null;
          state.role = null;
          localStorage.removeItem('token');
          localStorage.removeItem('role');
        }
      })

      // forgot password
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.message = payload.message;
      })
      .addCase(forgotPassword.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })

      // resend verification
      .addCase(resendVerificationEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resendVerificationEmail.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.message = payload.message;
      })
      .addCase(resendVerificationEmail.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })

      // update profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload;
        state.message = 'Profile updated successfully';
      })
      .addCase(updateProfile.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })

      // upload avatar
      .addCase(uploadAvatar.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadAvatar.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload;
        state.message = 'Avatar uploaded successfully';
      })
      .addCase(uploadAvatar.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })

      // change password
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.message = payload;
      })
      .addCase(changePassword.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      });
  },
});

// ✅ Export actions + reducer
export const { clearError, clearMessage, clearAuth } = authSlice.actions;
export default authSlice.reducer;