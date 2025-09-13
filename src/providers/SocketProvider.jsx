import { createContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { REQUEST } from "../constants/chat";

export const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MDBhNjIxYjM2MWJmNDhjN2NiN2I3ZCIsImVtYWlsIjoienhjdndlcnQzNDU4QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTGVvbmVsIiwiaWF0IjoxNzQ0ODcyOTk3LCJleHAiOjE3NDQ5NTkzOTd9.e2wFq4dxOMz1T1snOOl7aJtH2IJCw15vrxcBXKrIsEg";
  const socket = useMemo(() => io(`${process.env.REACT_APP_BASE_URL}`, { extraHeaders: { token } }), []);
  const [isConnected, setIsConnected] = useState(false);

  socket.on('connect', () => {
    setIsConnected(true);
  });

  socket.on('disconnect', () => {
    setIsConnected(false);
  });

  useEffect(() => {
    socket.emit(REQUEST.AUTH, token);
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{
        isConnected,
        socket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
