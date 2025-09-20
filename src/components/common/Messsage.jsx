import { Box, HStack, Spinner, Text, useBreakpointValue, VStack } from "@chakra-ui/react";
import { useContext, useMemo, useState } from "react";
import { AiFillPushpin } from "react-icons/ai";
import { FaCommentDots, FaRegSmile, FaTrash } from "react-icons/fa";

import { METHODS, TYPES } from "../../constants/chat";
import { AuthContext } from "../../providers/AuthProvider";
import { SocketContext } from "../../providers/SocketProvider";
import { formatTime } from "../../utils/time";

import { useNavigate, useParams } from "react-router-dom";
import Emoticon from "./Emoticon";
import Emoticons from "./Emoticons";
import FileMark from "./FileMark";
import UserAvatar from "./UserAvatar";

const Message = (props) => {
  const { message, showDate, ...etcProps } = props;
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
    const isPinned = message?.pinnedBy?.includes(user?._id);
    const pinnedBy = isPinned ? message.pinnedBy.filter((id) => id !== user?._id) : [...message.pinnedBy, user?._id];
    socket.emit(`${TYPES.MESSAGE}_${METHODS.UPDATE}`, { _id: message._id, pinnedBy });
  };

  // group emoticons
  const emoticons = useMemo(() => {
    return message?.emoticons?.reduce((prev, emoticon) => {
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
  const pinDisplay = useBreakpointValue({ base: "none", md: "block" });
  const fontSize1 = useBreakpointValue({ base: "sm", md: "md" });
  const fontSize2 = useBreakpointValue({ base: "md", md: "lg" });

  return (
    <HStack
      w="full"
      spacing={spacing}
      flexDirection={flexDir}
      onMouseEnter={() => setToolShow(true)}
      onMouseLeave={() => setToolShow(false)}
      position="relative"
      gap={8}
      flexWrap={"wrap"}
      shadow={"0 0 4px black"}
      bg="#f0f0f0"
      borderRadius="12px"
      p={4}
      pos="relative"
      {...etcProps}
    >
      {message ? (
        <>
          <VStack flex="1" align="stretch" gap={2}>
            <HStack align="center" flexWrap="wrap" gap={4} fontSize={fontSize1}>
              <UserAvatar w={"72px"} h={"72px"} url={message?.sender?.avatar} />
              <VStack flex={"1 1 0"} align={"flex-start"}>
                <Text fontWeight="bold" fontSize={"24px"} color={"var(--mainColor)"} isTruncated maxW="70%">
                  {message?.sender?.username?.toUpperCase() || "Unknown"}
                </Text>
                <HStack w={"full"} justify={"space-between"}>
                  <Text flexShrink={0} color="#555" whiteSpace="nowrap">
                    {formatTime(message?.createdAt)}
                  </Text>
                  <VStack minW={"28px"}>
                    {message?.pinnedBy?.includes(user?._id) && (
                      <Box display={pinDisplay} color="var(--mainColor)" fontSize="24px" title="Pinned" marginLeft={2}>
                        <AiFillPushpin />
                      </Box>
                    )}
                  </VStack>
                </HStack>
              </VStack>
            </HStack>
            <VStack w={"full"} flex={"1 1 0"} pl={"88px"} justify={"flex-start"} gap={2}>
              {message?.mentions?.length > 0 && (
                <HStack w={"full"} justify={"flex-start"} flexWrap="wrap" gap={2} mt={1} fontSize="sm">
                  {message?.mentions?.map((m) => {
                    const user = users.find((u) => u._id === m);
                    return (
                      <Text key={m} fontSize={"20px"} fontWeight="bold" color="#0066cc">
                        @{user?.username || "Unknown"}
                      </Text>
                    );
                  })}
                </HStack>
              )}
              <HStack w={"full"} justify={"flex-start"}>
                <Text fontSize={fontSize2} fontFamily={"cursive"} whiteSpace="pre-line" wordBreak="break-word" color="#222">
                  {message.content}
                </Text>
              </HStack>
              <HStack w={"full"} justify={"flex-start"} flexWrap="wrap" gap={1} mt={2}>
                {emoticons.map((emo, i) => (
                  <HStack key={i} align="center" fontSize="xs">
                    <Emoticon id={emo.code} fontSize={"24px"} onClick={() => handleEmos(emo.code)} />
                    <Text fontSize="xs" color="#555">
                      {emo.users.length}
                    </Text>
                  </HStack>
                ))}
              </HStack>
              <HStack w={"full"} justify={"flex-start"} gap={4}>
                {message.files.length > 0 && (
                  <HStack gap={4} mt={2} flexWrap="wrap">
                    {message.files.map((f, i) => (
                      <FileMark key={i} w={"56px"} h={"56px"} filename={f.filename} originalname={f.originalname} />
                    ))}
                  </HStack>
                )}
              </HStack>
            </VStack>
          </VStack>
          {toolShow && (
            <Box
              display="flex"
              alignItems="center"
              maxW="300px"
              pos={"absolute"}
              top={2}
              right={2}
              bg="#fff"
              borderRadius="8px"
              boxShadow="0 0 8px rgba(0,0,0,0.2)"
              px={3}
              py={2}
              zIndex={10}
              gap={4}
              flexWrap="wrap"
              onMouseLeave={() => setEmoShow(false)}
            >
              <Box cursor="pointer" onClick={() => setEmoShow(!emoShow)} title="Add Emoji">
                <FaRegSmile color={"ffcc00"} size={20} />
                {emoShow && <Emoticons pos={"absolute"} top="100%" right={0} bg="#fff" p={2} boxShadow={"0 0 4px black"} w="300px" handleEmos={handleEmos} />}
              </Box>
              <Box cursor="pointer" onClick={handlePin} title="Pin/Unpin">
                <AiFillPushpin size={20} color={"var(--mainColor)"} />
              </Box>
              {!message.parentID && curChannel.isChannel && (
                <Box
                  cursor="pointer"
                  color={"var(--secondaryColor)"}
                  onClick={() => {
                    setShowThread(!showThread || messageID !== message._id);
                    navigate(`/chatting/home/${channelID}/${message._id}`);
                  }}
                  title="Reply"
                >
                  <FaCommentDots size={20} />
                </Box>
              )}
              {message.sender._id === user?._id && (
                <Box cursor="pointer" color={"gray.400"} onClick={() => handleDelete(message._id)} title="Delete">
                  <FaTrash size={20} />
                </Box>
              )}
            </Box>
          )}
        </>
      ) : (
        <Spinner />
      )}
    </HStack>
  );
};

export default Message;
