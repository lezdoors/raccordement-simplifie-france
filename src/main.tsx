import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/mobile.css'
import { SecurityProvider } from './components/SecurityProvider'

createRoot(document.getElementById("root")!).render(
  <SecurityProvider>
    <App />
  </SecurityProvider>
);
