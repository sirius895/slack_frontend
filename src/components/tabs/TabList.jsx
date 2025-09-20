import { HStack, Text, useBreakpointValue, VStack } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { AiFillPushpin } from "react-icons/ai";
import { FaBreadSlice, FaFile, FaRegCommentDots } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import { SocketContext } from "../../providers/SocketProvider";
import UserAvatar from "../common/UserAvatar";

const TabList = (props) => {
  const { curTab, setCurTab } = props;
  const { user } = useContext(AuthContext);
  const { channels } = useContext(SocketContext);
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
  const titleWidth = useBreakpointValue({ base: "300px", md: "200px" });
  return (
    <VStack w={"full"} h={"100px"} px={4} pt={4} shadow={"0 0 4px black"}>
      <HStack w={"full"} justify={"space-between"}>
        <Text width={titleWidth} textOverflow={"ellipsis"} whiteSpace={"nowrap"} overflow={"hidden"} fontSize={"20px"} fontWeight={"extrabold"}>
          # {curChannel?.isChannel && curChannel?.name}
        </Text>
        <HStack gap={2}>
          <UserAvatar url={user.avatar} w={"32px"} h={"32px"}></UserAvatar>
          <Text fontWeight={"extrabold"} fontFamily={"cursive"} color={"var(--mainColor)"}>
            {user?.username?.toUpperCase()}
          </Text>
          <Text>{curChannel?.members?.length ? `+${curChannel?.members?.length - 1} members` : ""}</Text>
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
              color={curTab === t.key && "var(--mainColor)"}
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
