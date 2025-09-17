import { HStack, Image, VStack } from "@chakra-ui/react";
import { FaDownload } from "react-icons/fa";

const FileMark = (props) => {
  const { originalname, filename, w = "56px", h = "56px", ...etcProps } = props;
  let url = `${process.env.REACT_APP_BASE_URL}/files/${filename ? filename : "default.gif"}`;

  return (
    <VStack gap={2}>
      <Image src={url} w={w} h={h} rounded={"8px"} {...etcProps} />
      <HStack w={"full"} justify={"center"} align={"center"}>
        <FaDownload />
      </HStack>
    </VStack>
  );
};

export default FileMark;
