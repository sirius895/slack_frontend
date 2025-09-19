import { Flex } from "@chakra-ui/react";
import LoadingGif from "./LoadingGif";

const Loading = () => {
  return (
    <Flex w={"full"} h={"100vh"} justify={"center"} align={"center"} bg={"var(--mainColor)"}>
      <LoadingGif w1={"96px"} w2={"88px"} w3={"80px"} />
    </Flex>
  );
};

export default Loading;
