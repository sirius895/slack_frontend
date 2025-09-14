import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { METHODS, TYPES } from "../constants/chat";
import api from "../libs/axios";
import toast from "../utils/toast";
import { AuthContext } from "./AuthProvider";

export const SocketContext = createContext({
  isConnected: false,
  socket: () => { },
  users: [],
  setUsers: () => { },
  channels: [],
  setChannels: () => { }
});

const SocketProvider = ({ children }) => {
  const token = localStorage.token;
  const [users, setUsers] = useState([])
  const [channels, setChannels] = useState([])
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useContext(AuthContext)

  const socket = useMemo(() => io(`${process.env.REACT_APP_BASE_URL}`, { extraHeaders: { token } }), [user._id]);

  socket.on('connect', () => {
    setIsConnected(true);
  });

  socket.on('disconnect', () => {
    setIsConnected(false);
  });

  const listenChannelReadByUserID = (status, data) => {
    if (status) setChannels(data);
    else toast.ERROR(data)
  }

  useEffect(() => {
    if (user._id) {
      try {
        (async () => {
          const res = await api.get("/user")
          setUsers(res.data.payload)
        })()
      } catch (error) {
        toast.ERROR("Error Occured")
      }
    }
  }, [user._id])

  useEffect(() => {
    if (user._id) {
      socket.emit(TYPES.AUTH, token);
      socket.emit(`${TYPES.CHANNEL}_${METHODS.READ_BY_USER_ID}`, user._id)
      socket.on(`${TYPES.CHANNEL}_${METHODS.READ_BY_USER_ID}`, listenChannelReadByUserID);
    }
    return () => {
      socket.removeListener(`${TYPES.CHANNEL}_${METHODS.READ_BY_USER_ID}`, listenChannelReadByUserID)
    }
  }, [user._id])

  return (
    <SocketContext.Provider
      value={{
        isConnected, socket,
        users, setUsers,
        channels, setChannels
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
