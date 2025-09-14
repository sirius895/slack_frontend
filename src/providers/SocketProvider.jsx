import { createContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { METHODS, TYPES } from "../constants/chat";
import { useParams } from "react-router-dom";

export const SocketContext = createContext({
  isConnected: null,
  socket: null
});

const SocketProvider = ({ children }) => {
  const token = localStorage.token
  const socket = useMemo(() => io(`${process.env.REACT_APP_BASE_URL}`, { extraHeaders: { token } }), []);
  const [isConnected, setIsConnected] = useState(false);
  const params = useParams()
  console.log(params);


  socket.on('connect', () => {
    setIsConnected(true);
  });

  socket.on('disconnect', () => {
    setIsConnected(false);
  });

  useEffect(() => {
    socket.emit(TYPES.AUTH, token);
    socket.emit(`${TYPES.CHANNEL}_${METHODS.READ_BY_CHANNEL_ID}`)
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
