import { HStack, Image, Link, VStack } from "@chakra-ui/react";
import { FaDownload } from "react-icons/fa";

const FileMark = (props) => {
  const { originalname, filename, w = "56px", h = "56px", ...etcProps } = props;
  let url = `${process.env.REACT_APP_BASE_URL}/files/${filename ? filename : "default.gif"}`;
  const downloadURL = `${process.env.REACT_APP_BASE_URL}/file/download/${filename}/${originalname}`;

  return (
    <VStack gap={2}>
      <Link href={url} target="_blank">
        <Image src={url} w={w} h={h} rounded={"8px"} {...etcProps} />
      </Link>
      <HStack w={"full"} justify={"center"} align={"center"}>
        <Link href={downloadURL}>
          <FaDownload />
        </Link>
      </HStack>
    </VStack>
  );
};

export default FileMark;
