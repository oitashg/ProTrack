import { createSlice } from "@reduxjs/toolkit";

//The initital state of slice
const initialState = {
    //Initially loading is false
    loading: false,
}

//Creating slice using createSlice
const studentSlice = createSlice({
    name: "student",
    initialState: initialState,
    reducers: {
        setLoading(state, value) {
            state.loading = value.payload
        },
    }
})

export const {setLoading} = studentSlice.actions
export default studentSlice.reducer