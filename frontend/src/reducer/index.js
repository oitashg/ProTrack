import { combineReducers } from "@reduxjs/toolkit";

import studentReducer from "../slices/studentSlice"

const rootReducer = combineReducers({
    student: studentReducer,
})

export default rootReducer