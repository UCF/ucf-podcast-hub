import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import 'ucf-athena-framework/dist/css/framework.min.css'
import './index.scss';

import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
