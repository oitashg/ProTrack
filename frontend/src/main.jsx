// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import {configureStore} from "@reduxjs/toolkit"
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import rootReducer from './reducer/index.js';

//Central store is created here using configureStore and rootReducer is passed as reducer
//which contains/combines all reducers
const store = configureStore({
  reducer: rootReducer
})

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
      <Toaster/>
    </BrowserRouter>
  </Provider>
)
