import { HStack, Image, Link, Tooltip, VStack } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { FaDownload } from "react-icons/fa";

const FileMark = (props) => {
  const { originalname, filename, w = "56px", h = "56px", ...etcProps } = props;
  const [downloadShow, setDownloadShow] = useState(false);
  const [down, setDown] = useState(false);
  const type = useMemo(() => {
    if (/(.gif|.jpg|.png)$/.test(originalname)) return "imgae";
    if (/(.pdf)$/.test(originalname)) return "pdf";
    else return "file";
  }, [originalname]);
  let previewURL = `${process.env.REACT_APP_BASE_URL}/files/${
    filename ? (type === "imgae" && filename) || (type === "pdf" && "bookmark.jpg") || (type === "file" && "file.png") : "default.gif"
  }`;
  let linkURL = `${process.env.REACT_APP_BASE_URL}/files/${filename}`;
  const downloadURL = `${process.env.REACT_APP_BASE_URL}/file/download/${filename}/${originalname}`;

  return (
    <VStack gap={1} pos={"relative"} rounded={"8px"} shadow={"0 0 4px"} _hover={{ transform: "scale(1.08)", transition: "ease 0.4s" }}>
      <Tooltip label={originalname} hasArrow>
        <Link href={linkURL} target="_blank">
          <Image src={previewURL} w={w} h={h} rounded={"8px"} {...etcProps} _focus={{ outline: "none" }} />
        </Link>
      </Tooltip>
      <HStack
        pos={"absolute"}
        w={"40px"}
        h={"40px"}
        zIndex={4}
        top={"-20px"}
        right={"-20px"}
        onMouseLeave={() => setDownloadShow(false)}
        onMouseOver={() => setDownloadShow(true)}
      >
        {downloadShow && (
          <Link href={down ? downloadURL : "#"} bg={"white"} rounded={"8px"} p={2} _hover={{ shadow: "0 0 4px" }} onClick={() => setDown(true)}>
            {<FaDownload color={"var(--mainColor)"} />}
          </Link>
        )}
      </HStack>
    </VStack>
  );
};

export default FileMark;
