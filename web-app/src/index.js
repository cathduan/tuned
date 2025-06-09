/** 
 * @file Index.js
 * @description Initializes the React root. 
 * @authors Cathy Duan, Charlie Ney
 * @date 6/9/25
 */ 
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from "./components/AuthContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);