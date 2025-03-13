import React from 'react';
import { AuthProvider, useAuth } from "../context/AuthProvider";
import { Route, Routes } from 'react-router-dom';

const AppContent = () => {
  const { user } = useAuth();

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/channels" element={<Channels />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <div>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
