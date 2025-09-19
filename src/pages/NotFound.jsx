import { VStack, Text, Link, Tooltip } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <VStack w={"full"} h={"100vh"} fontSize={"28px"} bg={"var(--mainColor)"} justify={"center"} align={"center"}>
      <Tooltip hasArrow={true} label={"To Homepage"}>
        <Text color={"white"} onClick={() => navigate("/chatting/home/@/@")} cursor={"pointer"}>
          404 | Not Found
        </Text>
      </Tooltip>
    </VStack>
  );
};

export default NotFound;
