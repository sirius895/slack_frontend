import { VStack, HStack, Text, Avatar, Badge } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { FaFile, FaRegCommentDots } from "react-icons/fa";
import { AiFillPushpin } from "react-icons/ai";
import { SocketContext } from "../../providers/SocketProvider";
import { useParams } from "react-router-dom";
import UserAvatar from "../common/UserAvatar";
import { AuthContext } from "../../providers/AuthProvider";

const TabList = (props) => {
  const { curTab, setCurTab } = props;
  const { user } = useContext(AuthContext);
  const { channels, messages } = useContext(SocketContext);
  const { channel } = useParams();
  const [curChannel, setCurChannel] = useState({});

  useEffect(() => {
    setCurChannel(channels.find((c) => c._id === channel));
  }, [channel, channels]);

  const tabs = [
    { label: "Messages", key: "messages", icon: <FaRegCommentDots /> },
    { label: "Pins", key: "pins", icon: <AiFillPushpin /> },
    { label: "Files", key: "files", icon: <FaFile /> },
  ];

  return (
    <VStack w={"full"} h={"100px"} px={4} pt={4} shadow={"0 0 4px black"}>
      <HStack w={"full"} justify={"space-between"}>
        <Text fontSize={"20px"} fontWeight={"extrabold"}>
          # {curChannel?.name}
        </Text>
        <HStack gap={2}>
          <UserAvatar url={user.avatar} w={"32px"} h={"32px"}></UserAvatar>
          <Text fontWeight={"extrabold"} fontFamily={"cursive"} color={"var(--mainColor)"}>
            {user?.username?.toUpperCase()}
          </Text>
          <Text>{curChannel?.members?.length ? `+${curChannel?.members?.length - 1}` : ""}</Text>
        </HStack>
      </HStack>
      <HStack w={"full"} flexGrow={1}>
        {tabs.map((t, i) => {
          return (
            <HStack
              key={i}
              h={"full"}
              px={4}
              pt={4}
              pb={2}
              fontSize={curTab === t.key && "18px"}
              cursor={"pointer"}
              transition={"0.2s ease"}
              onClick={(e) => setCurTab(t.key)}
              borderBottom={curTab === t.key && "2px solid var(--mainColor)"}
              gap={2}
            >
              <Text fontWeight={"bold"}>{t.label}</Text>
              {t.icon}
            </HStack>
          );
        })}
      </HStack>
    </VStack>
  );
};

export default TabList;
