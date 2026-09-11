import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <Header />
          <div className="main-layout">
            <Sidebar />
            <main className="content">
              <AppRoutes />
            </main>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;

