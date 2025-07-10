import React from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const AppContent = () => {
  const { user, login, logout } = useAuth();

  return (
    <div>
      {user ? (
        <>
          <p>Welcome, {user.name}</p>
          <p>Role: {user.role}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={login}>Login with Google</button>
      )}
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
