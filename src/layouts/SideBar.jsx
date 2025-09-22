import { HStack, Text, VStack } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import * as FaIcons from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import UserAvatar from "../components/common/UserAvatar";
import { METHODS, TYPES } from "../constants/chat";
import { AuthContext } from "../providers/AuthProvider";
import { SocketContext } from "../providers/SocketProvider";
import toast from "../utils/toast";

const SideBar = () => {
  const navigate = useNavigate();
  const [setActivatedItem] = useState("HOME");
  const { socket, setUsers } = useContext(SocketContext);
  const { user, setUser } = useContext(AuthContext);
  const [showStateBar, setShowStateBar] = useState(false);
  const pageNavigate = (url, key) => {
    navigate(url);
    setActivatedItem(key);
  };
  const sideItems = [{ label: "HOME", icon: FaIcons.FaHome, key: "home" }];
  const states = [
    { label: "Offline", state: 1 },
    { label: "Sleep", state: 2 },
    { label: "Online", state: 3 },
    { label: "Sign Out", state: 0 },
  ];

  console.log(user);

  const changeState = (state) => {
    socket.emit(`${TYPES.AUTH}_${METHODS.UPDATE}`, { state });
  };
  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/");
    // sessionStorage.removeItem("nextURL");
    socket.emit(`${TYPES.AUTH}_${METHODS.UPDATE}`, { state: 0 });
  };

  const listenChangeState = (status, data) => {
    if (status && data) setUser(data);
    else toast.ERROR(data.message);
  };
  
  const listenBroadcast = (status, data) => {
    if (status && data) setUsers((users) => users.map((u) => (u._id === data._id ? data : u)));
    else toast.ERROR(data.message);
  };

  useEffect(() => {
    socket.on(`${TYPES.AUTH}_${METHODS.UPDATE}`, listenChangeState);
    socket.on(`${TYPES.AUTH}_${METHODS.BROADCAST}`, listenBroadcast);
    return () => socket.removeListener(`${TYPES.AUTH}_${METHODS.UPDATE}`, listenChangeState);
  }, []);

  return (
    <VStack minW={"var(--sideW)"} h={"full"} color={"white"} paddingBlock={4} bg={"var(--mainColor)"} justify={"space-between"}>
      {sideItems.map((v, i) => {
        return (
          <VStack key={i} w={"fit-content"} h={"fit-content"}>
            <HStack w={"40px"} h={"40px"} rounded={"8px"} bg={"var(--activeColor)"} justify={"center"} items={"center"}>
              {v.icon({ size: "20px", onClick: () => pageNavigate(`/chatting/${v.key}/@/@`) })}
            </HStack>
            <Text fontSize={12}>{v.label}</Text>
          </VStack>
        );
      })}
      <HStack pos={"relative"} onMouseOver={() => setShowStateBar(true)} onMouseLeave={() => setShowStateBar(false)}>
        <UserAvatar w={"40px"} h={"40px"} url={user?.avatar} state={user?.state} showState={true} borderColor={"var(--mainColor)"} />
        {showStateBar && (
          <VStack w={"120px"} rounded={8} pos={"absolute"} py={2} bottom={"100%"} left={0} bg={"var(--mainColor)"} shadow={"0 0 3px black"}>
            {states.map((s, i) => {
              return (
                <HStack
                  key={i}
                  w={"full"}
                  onClick={i === 3 ? handleSignOut : () => changeState(s.state)}
                  p={2}
                  cursor={"pointer"}
                  _hover={{ backgroundColor: "var(--secondaryColor)" }}
                >
                  <Text>{s.label}</Text>
                </HStack>
              );
            })}
          </VStack>
        )}
      </HStack>
    </VStack>
  );
};

export default SideBar;
