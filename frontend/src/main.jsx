import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux';
import store from './store/index.js';
import { persistor} from "./store/index.js";
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <App/>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)
