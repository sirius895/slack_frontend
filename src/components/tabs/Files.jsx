import { HStack, Text, VStack } from "@chakra-ui/react";
import { useContext, useMemo } from "react";
import { SocketContext } from "../../providers/SocketProvider";
import FileMark from "../common/FileMark";

const Files = () => {
  const { messages } = useContext(SocketContext);
  console.log(messages);

  const { imgs, pdfs } = useMemo(() => {
    const imgs = [];
    const pdfs = [];
    messages?.forEach((m) =>
      m.files?.forEach((f) => {
        const fileInfo = { originalname: f.originalname, filename: f.filename };
        if (/(.gif|.jpg|.png)$/.test(f.originalname)) imgs.push(fileInfo);
        if (/(.pdf)$/.test(f.originalname)) pdfs.push(fileInfo);
      })
    );
    return { imgs, pdfs };
  }, [messages]);

  return (
    <VStack w={"full"} h={"full"} justify={"flex-start"} p={4} gap={4} overflowY={"auto"}>
      <Text w={"full"} color={"var(--secondaryColor)"} fontWeight={"bold"} fontSize={"28px"}>
        Images
      </Text>
      {imgs.length ? (
        <HStack w={"full"} flexWrap={"wrap"} gap={8}>
          {imgs.map((img, i) => (
            <FileMark key={i} w={"80px"} h={"80px"} {...img} />
          ))}
        </HStack>
      ) : (
        <Text>No Images</Text>
      )}
      <Text w={"full"} color={"var(--secondaryColor)"} fontWeight={"bold"} fontSize={"28px"}>
        PDFs
      </Text>
      {pdfs.length ? (
        <HStack w={"full"} flexWrap={"wrap"} gap={8}>
          {pdfs.map((img, i) => (
            <FileMark key={i} w={"80px"} h={"80px"} {...img} />
          ))}
        </HStack>
      ) : (
        <Text>No PDF</Text>
      )}
    </VStack>
  );
};

export default Files;
