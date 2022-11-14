import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


export interface UserState {
    id: string 
    email: string
    fname: string
    lname: string
    role: number
}

export const enum Role {
    Guest = 0,
    User = 1,
    CEO = 2,
    Admin = 3,
}

const initialState: UserState = {
    id: '',
    email: '',
    fname: '',
    lname: '',
    role: Role.Guest
}

export const userSlice = createSlice({
    name: 'current_user',
    initialState: initialState,
    reducers: {
        login:(state, action: PayloadAction<UserState>)=>{
            state.id = action.payload.id;
            state.email = action.payload.email;
            state.fname = action.payload.fname;
            state.lname = action.payload.lname;
            state.role = action.payload.role;
        },

        logout:()=> initialState
    }
})

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;