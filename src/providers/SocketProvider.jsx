import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { METHODS, TYPES } from "../constants/chat";
import api from "../libs/axios";
import toast from "../utils/toast";
import { AuthContext } from "./AuthProvider";

export const SocketContext = createContext({
  isConnected: false,
  socket: () => {},
  users: [],
  setUsers: () => {},
  channels: [],
  setChannels: () => {},
  curChannel: {},
  setCurChannel: () => {},
  messages: [],
  setMessages: () => {},
  showThread: false,
  setShowThread: () => {},
});

const SocketProvider = ({ children }) => {
  const token = localStorage.token;
  const [users, setUsers] = useState([]);
  const [channels, setChannels] = useState([]);
  const [curChannel, setCurChannel] = useState({});
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useContext(AuthContext);
  const { channel, message } = useParams();
  const [showThread, setShowThread] = useState(false);

  const socket = useMemo(
    () => io(`${process.env.REACT_APP_BASE_URL}`, { extraHeaders: { token: localStorage.getItem("token") } }),
    [localStorage.getItem("token")]
  );

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      // toast.ERROR("Socket disconnected!");
    });
  }, []);

  const listenChannelReadByUserID = (status, data) => {
    if (status && data) {
      setChannels(data);
      setCurChannel(data.find((ch) => ch?._id === channel));
    } else toast.ERROR(data.message);
  };

  const listenMessageReadByChannelID = (status, data) => {
    if (status && data) setMessages(data);
    else toast.ERROR(data.message);
  };

  useEffect(() => {
    if (user?._id) {
      try {
        (async () => {
          const res = await api.get("/user");
          setUsers(res.data.payload);
        })();
      } catch (error) {
        toast.ERROR("Error Occured");
      }
    }
  }, [user?._id]);

  useEffect(() => {
    if (user?._id) {
      socket.emit(TYPES.AUTH, token);
      socket.emit(`${TYPES.AUTH}_${METHODS.UPDATE}`, { state: 3 });
      socket.emit(`${TYPES.CHANNEL}_${METHODS.READ_BY_USER_ID}`, user?._id);
      socket.on(`${TYPES.CHANNEL}_${METHODS.READ_BY_USER_ID}`, listenChannelReadByUserID);
    }
    return () => {
      socket.removeListener(`${TYPES.CHANNEL}_${METHODS.READ_BY_USER_ID}`, listenChannelReadByUserID);
    };
  }, [user?._id]);

  useEffect(() => {
    socket.on(TYPES.AUTH, (status, data) => {
      if (!status) toast.ERROR(data.message);
    });
  }, []);

  useEffect(() => {
    if (channel.length > 10) {
      socket.emit(`${TYPES.MESSAGE}_${METHODS.READ_BY_CHANNEL_ID}`, channel);
      socket.on(`${TYPES.MESSAGE}_${METHODS.READ_BY_CHANNEL_ID}`, listenMessageReadByChannelID);
    }
    return () => {
      socket.removeListener(`${TYPES.MESSAGE}_${METHODS.READ_BY_CHANNEL_ID}`, listenMessageReadByChannelID);
    };
  }, [channel]);

  const listenCreate = useCallback(
    (status, data) => {
      if (status && data) setChannels([...channels, data]);
      else toast.ERROR(data.message);
    },
    [channels, setChannels]
  );

  const listenUpdate = useCallback(
    (status, data) => {
      if (status && data) {
        // setChannels(channels => channels.map((c) => c._id === data._id ? data : c))
        socket.emit(`${TYPES.CHANNEL}_${METHODS.READ_BY_USER_ID}`, user?._id);
      } else toast.ERROR(data.message);
    },
    [socket, user?._id]
  );

  const listenDelete = useCallback(
    (status, data) => {
      if (status && data) setChannels((channels) => channels.filter((c) => c._id !== data._id));
      else toast.ERROR(data.message);
    },
    [setChannels]
  );

  useEffect(() => {
    socket.on(`${TYPES.CHANNEL}_${METHODS.CREATE}`, listenCreate);
    return () => socket.removeListener(`${TYPES.CHANNEL}_${METHODS.CREATE}`, listenCreate);
  }, [listenCreate, socket]);

  useEffect(() => {
    socket.on(`${TYPES.CHANNEL}_${METHODS.UPDATE}`, listenUpdate);
    return () => socket.removeListener(`${TYPES.CHANNEL}_${METHODS.UPDATE}`, listenUpdate);
  });

  useEffect(() => {
    socket.on(`${TYPES.CHANNEL}_${METHODS.DELETE}`, listenDelete);
    return () => socket.removeListener(`${TYPES.CHANNEL}_${METHODS.DELETE}`, listenDelete);
  });

  useEffect(() => {
    setShowThread(message.length > 10 ? true : false);
  }, [message]);

  return (
    <SocketContext.Provider
      value={{
        isConnected,
        socket,
        users,
        setUsers,
        channels,
        setChannels,
        curChannel,
        setCurChannel,
        messages,
        setMessages,
        showThread,
        setShowThread,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
