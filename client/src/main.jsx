import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import store from './app/store.js'
import { LanguageProvider } from './contexts/LanguageContext.jsx'
import { CurrencyProvider } from './contexts/CurrencyContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <LanguageProvider>
        <CurrencyProvider>
          <BrowserRouter
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            <App />
          </BrowserRouter>
        </CurrencyProvider>
      </LanguageProvider>
    </Provider>
  </StrictMode>,
)
