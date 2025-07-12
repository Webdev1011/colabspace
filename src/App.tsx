import React, { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Chat from "./pages/Chat";
import VideoCall from "./components/VideoCall";

const AppContent = () => {
  const { user, login, logout } = useAuth();
  const [videoCall, setVideoCall] = useState({
    userId: "",
    roomId: "",
  });
  useEffect(() => {
    if (user) {
      setVideoCall({
        userId: user.uid,
        roomId: "globalId",
      });
    }
  }, [user]);
  return (
    <div>
      {user ? (
        <>
          <p>Welcome, {user.name}</p>
          <p>Role: {user.role}</p>
          <button onClick={logout}>Logout</button>
          <Chat />
          {videoCall.roomId ? (
            <VideoCall userId={videoCall.userId} roomId={videoCall.roomId} />
          ) : null}
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
