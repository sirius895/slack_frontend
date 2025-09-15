import { HStack, VStack } from "@chakra-ui/react"
import { useCallback, useContext, useEffect, useRef } from "react"
import { METHODS, TYPES } from "../../constants/chat"
import { SocketContext } from "../../providers/SocketProvider"
import toast from "../../utils/toast"
import MessageEditor from "../common/MessageEditor"
import Message from "../common/Messsage"
import { useParams } from "react-router-dom"

const Messages = () => {
    const { socket, messages, setMessages } = useContext(SocketContext)
    const messageRef = useRef(null)
    const { channel } = useParams()

    const listenMessageCreate = useCallback((status, data) => {
        if (status && data && data.channelID === channel) setMessages([...messages, data])
        else toast.ERROR(data.message)
    }, [messages, setMessages])

    const listenMessageUpdate = useCallback((status, data) => {
        if (status && data) setMessages(msgs => msgs.map(msg => msg._id === data._id ? data : msg))
        else toast.ERROR(data.message)
    }, [setMessages])

    const listenMessageDelete = useCallback((status, data) => {
        if (status && data) setMessages(msgs => msgs.filter(m => m._id !== data))
        else toast.ERROR(data.message)
    }, [setMessages])

    useEffect(() => {
        listenMessageCreate && socket.on(`${TYPES.MESSAGE}_${METHODS.CREATE}`, listenMessageCreate)
        return () => socket.removeListener(`${TYPES.MESSAGE}_${METHODS.CREATE}`, listenMessageCreate)
    }, [listenMessageCreate, messages])

    useEffect(() => {
        listenMessageUpdate && socket.on(`${TYPES.MESSAGE}_${METHODS.UPDATE}`, listenMessageUpdate)
        return () => socket.removeListener(`${TYPES.MESSAGE}_${METHODS.UPDATE}`, listenMessageUpdate)
    }, [listenMessageUpdate, socket])

    useEffect(() => {
        listenMessageDelete && socket.on(`${TYPES.MESSAGE}_${METHODS.DELETE}`, listenMessageDelete)
        return () => socket.removeListener(`${TYPES.MESSAGE}_${METHODS.DELETE}`, listenMessageDelete)
    }, [listenMessageDelete, socket])

    useEffect(() => {
        const messageH = messageRef?.current?.getClientRects()[0].height;
        const parentH = messageRef?.current?.parentElement.getClientRects()[0].height;
        if (parentH <= messageH) messageRef.current.parentElement.scrollBy(0, messageH - parentH)
    }, [messages.length])

    return (
        <HStack w={"full"} h={"full"}>
            <VStack flex={"1 1 0"} h={"full"} p={4}>
                <VStack w={"full"} flex={"1 1 0"} overflowY={"auto"} scrollBehavior={"smooth"} gap={4}>
                    <VStack w={"full"} ref={messageRef}>
                        {messages.length && messages.map((m, i) => m.channelID === channel && !m.parentID && <Message key={i} message={m} />)}
                    </VStack>
                </VStack>
                <VStack w={"full"} h={"180px"}>
                    <MessageEditor isForThread={false} />
                </VStack>
            </VStack>
        </HStack>
    )
}

export default Messages