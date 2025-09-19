import { HStack } from "@chakra-ui/react";
import { emoticons } from "../../constants/emoticons";
import Emoticon from "./Emoticon";

const Emoticons = (props) => {
  const { handleEmos, ...etcProps } = props;

  return (
    <HStack w={"200px"} flexWrap={"wrap"} rounded={"8px"} bg={"white"} justify={"space-between"} shadow={"0 0 3px black"} p={2} {...etcProps}>
      {emoticons.map((emoticon) => (
        <Emoticon key={emoticon.id} w={"32px"} h={"32px"} id={emoticon.id} cursor="pointer" onClick={() => handleEmos?.(emoticon.id)} />
      ))}
    </HStack>
  );
};

export default Emoticons;
