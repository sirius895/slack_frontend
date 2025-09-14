import { Avatar, HStack, Text, VStack } from "@chakra-ui/react"
import { useCallback, useContext, useEffect, useState } from "react"
import { FaCaretDown, FaCaretRight, FaEdit, FaPlus, FaTrash } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { METHODS, TYPES } from "../../constants/chat"
import { AuthContext } from "../../providers/AuthProvider"
import { SocketContext } from "../../providers/SocketProvider"
import toast from "../../utils/toast"
import ChannelDeleteModal from "../modals/ChannelDeleteModal"
import DMModal from "../modals/DMModal"

const DMList = () => {
    const [showDM, setShowDM] = useState(true)
    const { socket, users, channels, setChannels, setCurChannel } = useContext(SocketContext)
    const [selectedID, setSelectedID] = useState(-1)
    const [modalStatus, setModalStatus] = useState("init")
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()

    const listenCreate = useCallback((status, data) => {
        if (status && data) setChannels([...channels, data])
        else toast.ERROR(data.message)
    }, [channels])

    const listenUpdate = useCallback((status, data) => {
        if (status && data) setChannels(channels => channels.map((c) => c._id === data._id ? data : c))
        else toast.ERROR(data.message)
    }, [channels])

    const listenDelete = useCallback((status, data) => {
        if (status && data) setChannels(channels => channels.filter((c) => c._id !== data._id))
        else toast.ERROR(data.message)
    }, [channels])

    useEffect(() => {
        socket.on(`${TYPES.CHANNEL}_${METHODS.CREATE}`, listenCreate)
        return () => socket.removeListener(`${TYPES.CHANNEL}_${METHODS.CREATE}`, listenCreate)
    }, [listenCreate])

    useEffect(() => {
        socket.on(`${TYPES.CHANNEL}_${METHODS.UPDATE}`, listenUpdate)
        return () => socket.removeListener(`${TYPES.CHANNEL}_${METHODS.UPDATE}`, listenUpdate)
    }, [listenUpdate])

    useEffect(() => {
        socket.on(`${TYPES.CHANNEL}_${METHODS.DELETE}`, listenDelete)
        return () => socket.removeListener(`${TYPES.CHANNEL}_${METHODS.DELETE}`, listenDelete)
    })

    return (
        <VStack w={"full"} paddingInline={2} >
            <DMModal isChannel={false} selectedID={selectedID} setSelectedID={setSelectedID} modalStatus={modalStatus} setModalStatus={setModalStatus} />
            <ChannelDeleteModal selectedID={selectedID} modalStatus={modalStatus} setSelectedID={setSelectedID} setModalStatus={setModalStatus} />
            <HStack w={"full"} gap={4} onClick={() => setShowDM(!showDM)}>
                {showDM ? <FaCaretDown /> : <FaCaretRight />}
                <Text fontSize={"20px"}>DMs</Text>
            </HStack>
            <VStack w={"full"} pl={2} py={2}>
                {showDM && channels.map((channel, i) => {
                    return (
                        !channel.isChannel && users.length &&
                        <HStack key={i} w={'full'}
                            gap={4} rounded={8} px={2} py={1}
                            _hover={{ backgroundColor: "var(--fontColor)" }} cursor={"pointer"}
                            justify={"space-between"} onClick={() => { setCurChannel(channel); navigate(`/chatting/home/${channel._id}/@`) }}>
                            <HStack gap={2}>
                                <Avatar w={"24px"} h={"24px"} />
                                <Text>{users.find(u => u._id === channel.creator).username}</Text>
                            </HStack>
                            <HStack gap={2}>
                                {channel.creator === user._id && <FaEdit onClick={() => { setSelectedID(i); setModalStatus("edit") }} />}
                                {channel.creator === user._id && <FaTrash onClick={() => { setSelectedID(i); setModalStatus("delete") }} />}
                            </HStack>
                        </HStack>
                    )
                })}
            </VStack>
            <HStack w={"full"} gap={4} justify={"flex-start"} cursor={"pointer"} onClick={() => { setModalStatus("add") }}>
                <FaPlus />
                <Text>Invite People</Text>
            </HStack>
        </VStack>
    )
}

export default DMList