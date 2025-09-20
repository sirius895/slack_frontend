import { HStack, VStack } from "@chakra-ui/react";
import { useContext, useState } from "react";
import Files from "../components/tabs/Files";
import Messages from "../components/tabs/Messages";
import Pins from "../components/tabs/Pins";
import TabList from "../components/tabs/TabList";
import Thread from "../components/thread/Thread";
import { SocketContext } from "../providers/SocketProvider";

const Main = () => {
  const { showThread } = useContext(SocketContext);
  const [curTab, setCurTab] = useState("messages");

  return (
    <HStack w={"full"} h={"full"} roundedRight={"8px"}>
      <VStack flex={"1 1 0"} h={"full"} bg={"white"}>
        <TabList curTab={curTab} setCurTab={setCurTab} />
        {curTab === "messages" && <Messages />}
        {curTab === "pins" && <Pins />}
        {curTab === "files" && <Files />}
      </VStack>
      {showThread && <Thread />}
    </HStack>
  );
};

export default Main;
