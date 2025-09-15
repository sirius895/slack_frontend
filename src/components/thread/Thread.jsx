import { HStack, Text, VStack } from "@chakra-ui/react"
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { FaTimes } from "react-icons/fa"
import { useParams } from "react-router-dom"
import { METHODS, TYPES } from "../../constants/chat"
import { SocketContext } from "../../providers/SocketProvider"
import toast from "../../utils/toast"
import MessageEditor from "../common/MessageEditor"
import Message from "../common/Messsage"

const Thread = () => {
    const { setShowThread, socket } = useContext(SocketContext)
    const [messages, setMessages] = useState([])
    const { message } = useParams()
    const messageRef = useRef(null)

    const listenMessageReadByParentID = (status, data) => {
        if (status && data) setMessages(data);
        else toast.ERROR(data.message)
    }

    const listenMessageCreate = useCallback((status, data) => {
        console.log(data);
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
        console.log("here");

        listenMessageCreate && socket.on(`${TYPES.MESSAGE}_${METHODS.READ_BY_PARENT_ID}`, listenMessageReadByParentID)
        return () => socket.removeListener(`${TYPES.MESSAGE}_${METHODS.READ_BY_CHANNEL_ID}`, listenMessageReadByParentID)
    }, [message])

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
        else setMessages([])
    }, [message])

    useEffect(() => {
        const messageH = messageRef?.current?.getClientRects()[0].height;
        const parentH = messageRef?.current?.parentElement.getClientRects()[0].height;
        if (parentH <= messageH) messageRef.current.parentElement.scrollBy(0, messageH - parentH)
    }, [messages.length])

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
            <VStack w={"full"} flex={"1 1 0"} overflowY={"auto"} py={4}>
                <VStack w={"full"} px={4} flex={"1 1 0"} scrollBehavior={"smooth"} gap={4}>
                    <VStack w={"full"} ref={messageRef}>
                        {messages.length && messages.map((m, i) => <Message key={i} message={m} />)}
                    </VStack>
                </VStack>
                <VStack w={"full"} minH={"180px"} pos={"sticky"} max={"180px"} px={4}>
                    <MessageEditor isForThread={true} />
                </VStack>
            </VStack>
        </VStack>
    )
}

export default Thread