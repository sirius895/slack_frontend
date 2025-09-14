import { HStack, VStack, Text } from "@chakra-ui/react"
import { useContext, useState } from "react"
import { FaCaretDown, FaCaretRight, FaEdit, FaPlus, FaTrash } from "react-icons/fa"
import { SocketContext } from "../providers/SocketProvider"
import CreateChannelModal from "./ChannelModal"
import { AuthContext } from "../providers/AuthProvider"

const ChannelList = () => {
    const [showCh, setShowCh] = useState(true)
    const { socket, channels, setChannels } = useContext(SocketContext)
    const [isOpen, setIsOpen] = useState(false)
    const [selectedID, setSelectedID] = useState(-1)
    const [modalStatus, setModalStatus] = useState("init")
    const { user } = useContext(AuthContext)

    return (
        <VStack w={"full"} paddingInline={2} >
            <CreateChannelModal isChannel={true} isOpen={isOpen} setIsOpen={setIsOpen} selectedID={selectedID} modalStatus={modalStatus} />
            <HStack w={"full"} gap={4} onClick={() => setShowCh(!showCh)}>
                {showCh ? <FaCaretDown /> : <FaCaretRight />}
                <Text fontSize={"20px"}>Channels</Text>
            </HStack>
            <VStack w={"full"} pl={2} py={2}>
                {showCh && channels.map((channel, i) => {
                    return (
                        <HStack key={i} w={'full'} gap={4} cursor={"pointer"} justify={"space-between"} onClick={() => setSelectedID(i)}>
                            <HStack>
                                <Text>#</Text>
                                <Text>{channel.name}</Text>
                            </HStack>
                            <HStack gap={2}>
                                {channel.creator === user._id && <FaEdit onClick={() => { setSelectedID(i); setIsOpen(true); setModalStatus("edit") }} />}
                                {channel.creator === user._id && <FaTrash />}
                            </HStack>
                        </HStack>
                    )
                })}
            </VStack>
            <HStack w={"full"} gap={4} justify={"flex-start"} cursor={"pointer"} onClick={() => { setIsOpen(true); setModalStatus("add") }}>
                <FaPlus />
                <Text>Add Channel</Text>
            </HStack>
        </VStack>
    )
}

export default ChannelList