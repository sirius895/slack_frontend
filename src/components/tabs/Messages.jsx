import { Divider, HStack, Text, VStack } from "@chakra-ui/react";
import { useCallback, useContext, useEffect, useRef } from "react";
import { METHODS, TYPES } from "../../constants/chat";
import { SocketContext } from "../../providers/SocketProvider";
import toast from "../../utils/toast";
import MessageEditor from "../common/MessageEditor";
import Message from "../common/Messsage";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import { formatDate } from "../../utils/time";

const Messages = () => {
  const { socket, messages, setMessages } = useContext(SocketContext);
  const messageRef = useRef(null);
  const { channel } = useParams();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const messageH = messageRef?.current?.getClientRects()[0].height;
    const parentH = messageRef?.current?.parentElement.getClientRects()[0].height;
    if (parentH <= messageH) messageRef.current.parentElement.scrollBy(0, messageH - parentH + 60);
  }, [messages.length]);
  return (
    <HStack w={"full"} h={"full"}>
      <VStack flex={"1 1 0"} h={"full"} p={4}>
        <VStack w={"full"} flex={"1 1 0"} px={2} py={4} overflowY={"auto"} scrollBehavior={"smooth"} gap={4}>
          <VStack w={"full"} gap={8} ref={messageRef}>
            {messages.length &&
              messages.map(
                (m, i) =>
                  m.channelID === channel &&
                  !m.parentID && (
                    <VStack w={"full"} gap={4} key={i} 
                    // align={m.sender._id !== user?._id ? "flex-end" : "flex-start" }
                    >
                      {formatDate(messages[i - 1]?.createdAt) !== formatDate(m?.createdAt) && (
                        <HStack w={"full"}>
                          <Divider border={"2px"} borderRadius={"2xl"} />
                          <Text>{formatDate(m.createdAt)}</Text>
                          <Divider border={"2px"} borderRadius={"2xl"} />
                        </HStack>
                      )}
                      <Message message={m} w={"100%"} /* maxW={"600px"} */ />
                    </VStack>
                  )
              )}
          </VStack>
        </VStack>
        <VStack w={"full"} h={"180px"} maxH={"180px"}>
          <MessageEditor isForThread={false} />
        </VStack>
      </VStack>
    </HStack>
  );
};

export default Messages;
