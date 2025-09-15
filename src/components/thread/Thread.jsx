import { HStack, Text, VStack } from "@chakra-ui/react"
import { useCallback, useContext, useEffect, useRef } from "react"
import { FaTimes } from "react-icons/fa"
import { useParams } from "react-router-dom"
import { METHODS, TYPES } from "../../constants/chat"
import { SocketContext } from "../../providers/SocketProvider"
import toast from "../../utils/toast"
import MessageEditor from "../common/MessageEditor"

const Thread = () => {
    const { showThread, setShowThread, socket, messages, setMessages } = useContext(SocketContext)
    const { message } = useParams()
    const messageRef = useRef(null)

    const listenMessageCreate = useCallback((status, data) => {
        if (status && data) setMessages([...messages, data])
        else toast.ERROR(data.message)
    }, [messages])

    const listenMessageUpdate = useCallback((status, data) => {
        if (status && data) setMessages(msgs => msgs.map(msg => msg._id === data._id ? data : msg))
        else toast.ERROR(data.message)
    }, [messages])

    const listenMessageDelete = useCallback((status, data) => {
        if (status && data) setMessages(msgs => msgs.filter(m => m._id !== data))
        else toast.ERROR(data.message)
    }, [messages])

    useEffect(() => {
        listenMessageCreate && socket.on(`${TYPES.MESSAGE}_${METHODS.CREATE}`, listenMessageCreate)
        return () => socket.removeListener(`${TYPES.MESSAGE}_${METHODS.CREATE}`, listenMessageCreate)
    }, [listenMessageCreate])

    useEffect(() => {
        listenMessageUpdate && socket.on(`${TYPES.MESSAGE}_${METHODS.UPDATE}`, listenMessageUpdate)
        return () => socket.removeListener(`${TYPES.MESSAGE}_${METHODS.UPDATE}`, listenMessageUpdate)
    }, [listenMessageUpdate])

    useEffect(() => {
        listenMessageDelete && socket.on(`${TYPES.MESSAGE}_${METHODS.DELETE}`, listenMessageDelete)
        return () => socket.removeListener(`${TYPES.MESSAGE}_${METHODS.DELETE}`, listenMessageDelete)
    }, [listenMessageDelete])

    useEffect(() => {
        if (message.length > 1) socket.emit(`${TYPES.MESSAGE}_${METHODS.READ_BY_PARENT_ID}`, message)
    }, [message])

    useEffect(() => {
        const messageH = messageRef?.current?.getClientRects()[0].height;
        const parentH = messageRef?.current?.parentElement.getClientRects()[0].height;
        if (parentH <= messageH) messageRef.current.parentElement.scrollBy(0, messageH - parentH)
    }, [messages])
    return (
        <VStack w={"300px"} h={"full"} bg={"white"} shadow={"0 0 4px black"} roundedRight={"8px"}>
            <VStack w={"full"} h={"100px"} px={4} pt={4}>
                <HStack w={"full"} h={"full"} justify={"space-between"} align={"flex-start"}>
                    <Text fontWeight={"extrabold"} fontSize={"20px"}>
                        Thread
                    </Text>
                    <FaTimes cursor={"pointer"} onClick={() => setShowThread(false)} />
                </HStack>
            </VStack>
            <VStack w={"full"} h={"180px"} px={4}>
                <MessageEditor />
            </VStack>
        </VStack>
    )
}

export default Thread