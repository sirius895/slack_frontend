import { Box, Flex, HStack, Text, useBreakpointValue, VStack } from "@chakra-ui/react";
import { useContext, useMemo, useState } from "react";
import { AiFillPushpin } from "react-icons/ai";
import { FaCommentDots, FaRegSmile, FaTrash } from "react-icons/fa";

import { METHODS, TYPES } from "../../constants/chat";
import { AuthContext } from "../../providers/AuthProvider";
import { SocketContext } from "../../providers/SocketProvider";
import { formatTime } from "../../utils/time";

import Emoticon from "./Emoticon";
import Emoticons from "./Emoticons";
import FileMark from "./FileMark";
import UserAvatar from "./UserAvatar";
import { useNavigate, useParams } from "react-router-dom";

const Message = (props) => {
  const { message, ...etcProps } = props;
  const { user } = useContext(AuthContext);
  const { socket, showThread, setShowThread, users, curChannel } = useContext(SocketContext);
  const [toolShow, setToolShow] = useState(false);
  const [emoShow, setEmoShow] = useState(false);
  const navigate = useNavigate();
  const { channel: channelID, message: messageID } = useParams();

  // handle delete message
  const handleDelete = (_id) => {
    socket.emit(`${TYPES.MESSAGE}_${METHODS.DELETE}`, _id);
  };

  // handle adding emoticons
  const handleEmos = (code) => {
    socket.emit(`${TYPES.MESSAGE}_${METHODS.HANDLE_EMOS}`, { messageID: message._id, code });
  };

  // handle pin/unpin message
  const handlePin = () => {
    const isPinned = message.pinnedBy.includes(user?._id);
    const pinnedBy = isPinned ? message.pinnedBy.filter((id) => id !== user?._id) : [...message.pinnedBy, user?._id];
    socket.emit(`${TYPES.MESSAGE}_${METHODS.UPDATE}`, { _id: message._id, pinnedBy });
  };

  // group emoticons
  const emoticons = useMemo(() => {
    return message.emoticons.reduce((prev, emoticon) => {
      const group = prev.find((g) => g.code === emoticon.code);
      if (!group) {
        return [...prev, { code: emoticon.code, users: [emoticon.sender] }];
      }
      return prev.map((g) => (g.code === emoticon.code ? { ...g, users: [...g.users, emoticon.sender] } : g));
    }, []);
  }, [message]);

  // Responsive layout values
  const flexDir = useBreakpointValue({ base: "column", md: "row" });
  const spacing = useBreakpointValue({ base: 2, md: 4 });
  const maxW = useBreakpointValue({ base: "100%", md: "600px" });
  const showPinned = useBreakpointValue({ base: false, md: true });
  const toolTop = useBreakpointValue({ base: -1, md: -2 });
  const toolRight = useBreakpointValue({ base: 0, md: 0 });
  const pinDisplay = useBreakpointValue({ base: "none", md: "block" });

  return (
    <VStack w="full" maxW={maxW} align="stretch" bg="#f0f0f0" borderRadius="12px" p={4} boxShadow="sm" pos="relative" spacing={3} {...etcProps}>
      <HStack
        w="full"
        spacing={spacing}
        flexDirection={flexDir}
        onMouseEnter={() => setToolShow(true)}
        onMouseLeave={() => setToolShow(false)}
        position="relative"
        gap={4}
        flexWrap={"wrap"}
      >
        <UserAvatar url={message.sender.avatar} />
        <VStack flex="1" align="stretch" spacing={3}>
          <Flex align="center" justify="space-between" flexWrap="wrap" gap={2} fontSize={useBreakpointValue({ base: "sm", md: "md" })}>
            <Text fontWeight="bold" color={"var(--mainColor)"} isTruncated maxW="70%">
              {message.sender?.username.toUpperCase() || "Unknown"}
            </Text>
            <Text flexShrink={0} color="#555" whiteSpace="nowrap">
              {formatTime(message.createdAt)}
            </Text>
          </Flex>
          {message.mentions.length > 0 && (
            <HStack flexWrap="wrap" gap={2} mt={1} fontSize="sm">
              {message.mentions.map((m) => {
                const user = users.find((u) => u._id === m);
                return (
                  <Text key={m} fontWeight="bold" color="#0066cc">
                    @{user?.username || "unknown"}
                  </Text>
                );
              })}
            </HStack>
          )}
          <Text fontSize={useBreakpointValue({ base: "md", md: "lg" })} whiteSpace="pre-line" wordBreak="break-word" color="#222">
            {message.content}
          </Text>
          <HStack flexWrap="wrap" gap={1} mt={2}>
            {emoticons.map((emo, i) => (
              <HStack key={i} align="center" fontSize="xs">
                <Emoticon id={emo.code} onClick={() => handleEmos(emo.code)} />
                <Text fontSize="xs" color="#555">
                  {emo.users.length}
                </Text>
              </HStack>
            ))}
          </HStack>
          <HStack w={"full"} flex={"1 1 0"} justify={"flex-end"} gap={4}>
            {message.files.length > 0 && (
              <HStack gap={2} mt={2} flexWrap="wrap" justify={"flex-end"}>
                {message.files.map((f, i) => (
                  <FileMark key={i} w={"56px"} h={"56px"} filename={f.filename} originalname={f.originalname} />
                ))}
              </HStack>
            )}
            <VStack minW={"28px"}>
              {message?.pinnedBy?.includes(user?._id) && (
                <Box display={pinDisplay} color="var(--mainColor)" fontSize="24px" title="Pinned" marginLeft={2}>
                  <AiFillPushpin />
                </Box>
              )}
            </VStack>
          </HStack>
        </VStack>
        {toolShow && (
          <Box
            position="absolute"
            top={toolTop}
            right={toolRight}
            bg="#fff"
            borderRadius="8px"
            boxShadow="0 0 8px rgba(0,0,0,0.2)"
            px={3}
            py={2}
            zIndex={10}
            display="flex"
            gap={4}
            alignItems="center"
            flexWrap="wrap"
            maxW="300px"
          >
            <Box cursor="pointer" onClick={() => setEmoShow(!emoShow)} onMouseLeave={() => setEmoShow(false)} title="Add Emoji">
              <FaRegSmile color={"ffcc00"} size={20} />
              {emoShow && (
                <Emoticons pos={"absolute"} top="100%" right={0} bg="#fff" p={2} borderRadius="4px" boxShadow="md" maxW="250px" handleEmos={handleEmos} />
              )}
            </Box>
            {!message.parentID && curChannel.isChannel && (
              <Box
                cursor="pointer"
                onClick={() => {
                  setShowThread(!showThread);
                  navigate(`/chatting/home/${channelID}/${message._id}`);
                }}
                title="Reply"
              >
                <FaCommentDots color={"green.400"} size={20} />
              </Box>
            )}
            <Box cursor="pointer" onClick={handlePin} title="Pin/Unpin">
              <AiFillPushpin size={20} />
            </Box>
            {message.sender._id === user?._id && (
              <Box cursor="pointer" onClick={() => handleDelete(message._id)} title="Delete">
                <FaTrash size={20} color="red.400" />
              </Box>
            )}
          </Box>
        )}
      </HStack>
    </VStack>
  );
};

export default Message;
