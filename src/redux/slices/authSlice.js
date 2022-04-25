import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: {}
  },
  reducers: {
    authenticate: (state, action) => {
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload.access_token)
    },
    logout: (state) => {
      state.isAuthenticated = false
      localStorage.removeItem('token')
    },
    setUser: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { authenticate, logout, setUser} = authSlice.actions

export const selectUser = (state) => state.auth.user

export default authSlice.reducer