import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import {FirebaseProvider} from '../src/Services/context.tsx'
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <FirebaseProvider>

    <HelmetProvider>
      <App />
    </HelmetProvider>
       <Toaster position="top-center" />
    </FirebaseProvider>

    </BrowserRouter>
  </StrictMode>,
)
