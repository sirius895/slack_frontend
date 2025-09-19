import { Flex, Spinner, Text } from "@chakra-ui/react";

const LoadingGif = ({ label = "Loading...", w1, w2, w3 }) => {
  return (
    <Flex justify={"center"} align={"center"} pos={"relative"}>
      <Spinner position={"absolute"} thickness={2} size={"xl"} p={w1} color={"#c1abff"} speed="1.6s" />
      <Spinner position={"absolute"} thickness={2} size={"xl"} p={w2} color={"#8e6ae1"} speed="1.2s" />
      <Spinner position={"absolute"} thickness={2} size={"xl"} p={w3} color={"#714ac9"} speed="1.0s" />
      <Text fontFamily={"cursive"} fontWeight={"extrabold"} pos={"absolute"} color={"var(--fontColor)"}>
        {label}
      </Text>
    </Flex>
  );
};

export default LoadingGif;
