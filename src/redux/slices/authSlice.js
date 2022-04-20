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
    login: (state) => {
      state.isAuthenticated = true
    },
    setUser: (state, action) => {
      state.user = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { authenticate, logout, login, setUser} = authSlice.actions

export default authSlice.reducer