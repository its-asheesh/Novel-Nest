import { createSlice } from "@reduxjs/toolkit";

// Get the initial state from localStorage (if exists)
const storedLoginState = localStorage.getItem("isLoggedIn") === "true";
const storedRole = localStorage.getItem("role") || "user";

const authSlice = createSlice({
    name: "auth",
    initialState: { 
        isLoggedIn: storedLoginState, 
        role: storedRole 
    },
    reducers: {
        login(state, action) {
            state.isLoggedIn = true;
            const { role } = action.payload; // Pass role during login
            state.role = role;
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("role", role);
        },
        logout(state) {
            state.isLoggedIn = false;
            state.role = "user";
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("role");
        },
        changeRole(state, action) {
            const role = action.payload;
            state.role = role;
            localStorage.setItem("role", role);
        },
    },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
