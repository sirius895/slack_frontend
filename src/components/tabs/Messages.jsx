import { VStack } from "@chakra-ui/react"
import { useCallback, useContext, useEffect, useRef } from "react"
import { METHODS, TYPES } from "../../constants/chat"
import { SocketContext } from "../../providers/SocketProvider"
import toast from "../../utils/toast"
import MessageEditor from "../common/MessageEditor"
import Message from "../common/Messsage"

const Messages = () => {
    const { socket, messages, setMessages } = useContext(SocketContext)
    const messageRef = useRef(null)
    const listenMessageCreate = useCallback((status, data) => {
        if (status && data) setMessages([...messages, data])
        else toast.ERROR(data.message)
    }, [messages])

    const listenMessageDelete = useCallback((status, data) => {
        console.log(data);

        if (status && data) setMessages(msgs => msgs.filter(m => m._id !== data))
        else toast.ERROR(data.message)
    }, [messages])

    useEffect(() => {
        listenMessageCreate && socket.on(`${TYPES.MESSAGE}_${METHODS.CREATE}`, listenMessageCreate)
        return () => socket.removeListener(`${TYPES.MESSAGE}_${METHODS.CREATE}`, listenMessageCreate)
    }, [listenMessageCreate])

    useEffect(() => {
        listenMessageDelete && socket.on(`${TYPES.MESSAGE}_${METHODS.DELETE}`, listenMessageDelete)
        return () => socket.removeListener(`${TYPES.MESSAGE}_${METHODS.DELETE}`, listenMessageDelete)
    }, [listenMessageDelete])

    useEffect(() => {
        const messageH = messageRef?.current?.getClientRects()[0].height;
        const parentH = messageRef?.current?.parentElement.getClientRects()[0].height;
        if (parentH <= messageH) messageRef.current.parentElement.scrollBy(0, messageH - parentH)
    }, [messages])

    return (
        <VStack w={"full"} flex={"1 1 0"} p={4}>
            <VStack w={"full"} flex={"1 1 0"} overflowY={"auto"} scrollBehavior={"smooth"} gap={4}>
                <VStack w={"full"} ref={messageRef}>
                    {
                        messages.length && messages.map((m, i) => {
                            return (
                                <Message key={i} message={m} />
                            )
                        })
                    }
                </VStack>
            </VStack>
            <VStack w={"full"} h={"180px"}>
                <MessageEditor />
            </VStack>
        </VStack>
    )
}

export default Messages