import { VStack, HStack, Text } from "@chakra-ui/react"
import { useContext, useEffect, useState } from "react"
import { SocketContext } from "../../providers/SocketProvider"
import { useParams } from "react-router-dom";

const TabList = (props) => {
    const { curTab, setCurTab } = props
    const { channels } = useContext(SocketContext);
    const { channel } = useParams();
    const [curChannel, setCurChannel] = useState({})

    useEffect(() => {
        setCurChannel(channels.find(c => c._id === channel))
    }, [channel, channels])

    return (
        <VStack w={"full"} h={"100px"} px={4} pt={4} shadow={"0 0 4px black"}>
            <HStack w={"full"}>
                <Text fontSize={"20px"} fontWeight={"extrabold"}># {curChannel?.name}</Text>
            </HStack>
            <HStack w={"full"} flexGrow={1}>
                <HStack h={"full"} px={4} pt={4} pb={2} fontSize={curTab === "messages" && "18px"} cursor={"pointer"} transition={"0.2s ease"} onClick={e => setCurTab("messages")} borderBottom={curTab === "messages" && "2px solid var(--mainColor)"}><Text fontWeight={"bold"}>Messages</Text></HStack>
                <HStack h={"full"} px={4} pt={4} pb={2} fontSize={curTab === "pins" && "18px"} cursor={"pointer"} transition={"0.2s ease"} onClick={e => setCurTab("pins")} borderBottom={curTab === "pins" && "2px solid var(--mainColor)"}><Text fontWeight={"bold"}>Pins</Text></HStack>
                <HStack h={"full"} px={4} pt={4} pb={2} fontSize={curTab === "files" && "18px"} cursor={"pointer"} transition={"0.2s ease"} onClick={e => setCurTab("files")} borderBottom={curTab === "files" && "2px solid var(--mainColor)"}><Text fontWeight={"bold"}>Files</Text></HStack>
            </HStack>
        </VStack>
    )
}

export default TabList 