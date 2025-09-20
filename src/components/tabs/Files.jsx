import { Divider, HStack, Text, VStack } from "@chakra-ui/react";
import { useContext, useMemo } from "react";
import { SocketContext } from "../../providers/SocketProvider";
import FileMark from "../common/FileMark";

const Files = () => {
  const { messages } = useContext(SocketContext);

  const { imgs, pdfs, etcs } = useMemo(() => {
    const imgs = [];
    const pdfs = [];
    const etcs = [];
    messages?.forEach((m) =>
      m.files?.forEach((f) => {
        const fileInfo = { originalname: f.originalname, filename: f.filename };
        if (/(.gif|.jpg|.png)$/.test(f.originalname)) !imgs.find((img) => img.originalname === f.originalname) && imgs.push(fileInfo);
        else if (/(.pdf)$/.test(f.originalname)) !pdfs.find((pdf) => pdf.originalname === f.originalname) && pdfs.push(fileInfo);
        else !etcs.find((etc) => etc.originalname === f.originalname) && etcs.push(fileInfo);
      })
    );
    return { imgs, pdfs, etcs };
  }, [messages]);

  const FileGroups = [
    { label: "Images", data: imgs },
    { label: "PDFs", data: pdfs },
    { label: "ETCs", data: etcs },
  ];

  return (
    <VStack w={"full"} h={"full"} justify={"flex-start"} p={4} gap={4} overflowY={"auto"}>
      {FileGroups.map((group, i) => (
        <VStack key={i} w={"full"}>
          <HStack w={"full"} gap={4}>
            <Text color={"var(--secondaryColor)"} fontWeight={"bold"} fontSize={"28px"}>
              {group.label}
            </Text>
            <Divider borderColor={"gray.400"} />
          </HStack>
          {group.data.length ? (
            <HStack w={"full"} flexWrap={"wrap"} gap={8}>
              {group.data.map((fileIf, j) => (
                <FileMark key={j} w={"80px"} h={"80px"} {...fileIf} />
              ))}
            </HStack>
          ) : (
            <Text>No {group.label}</Text>
          )}
        </VStack>
      ))}
    </VStack>
  );
};

export default Files;
