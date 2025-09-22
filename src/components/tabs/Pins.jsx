import { HStack, VStack } from "@chakra-ui/react";
import { useContext, useEffect, useRef } from "react";
import { SocketContext } from "../../providers/SocketProvider";
import Message from "../common/Messsage";
import { AuthContext } from "../../providers/AuthProvider";

const Pins = () => {
  const { messages } = useContext(SocketContext);
  const { user } = useContext(AuthContext);
  const messageRef = useRef();
  useEffect(() => {
    const messageH = messageRef?.current?.getClientRects()[0].height;
    const parentH = messageRef?.current?.parentElement.getClientRects()[0].height;
    if (parentH <= messageH) messageRef.current.parentElement.scrollBy(0, messageH - parentH);
  }, [messages]);
  return (
    <VStack w={"full"} flex={"1 1 0"} overflowY={"auto"} scrollBehavior={"smooth"} gap={4} p={4}>
      <VStack w={"full"} ref={messageRef} gap={4} p={2}>
        {messages.length &&
          messages
            .filter((m) => m.pinnedBy.includes(user?._id))
            .map((m, i) => (
              <HStack key={i} w={"full"} /* justify={m.sender._id !== user?._id && "flex-end"} */>
                <Message key={i} message={m} w={"100%"} /* maxW={"600px"} */ />
              </HStack>
            ))}
      </VStack>
    </VStack>
  );
};

export default Pins;
