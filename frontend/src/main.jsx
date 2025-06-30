import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './components/ThemeProvider';

createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <BrowserRouter>
      <App />
      <Toaster/>
    </BrowserRouter>
  </ThemeProvider>
)
