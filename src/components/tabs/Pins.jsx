import { VStack } from "@chakra-ui/react"
import { useContext, useEffect, useRef } from "react"
import { SocketContext } from "../../providers/SocketProvider"
import Message from "../common/Messsage"
import { AuthContext } from "../../providers/AuthProvider"

const Pins = () => {
    const { messages } = useContext(SocketContext)
    const { user } = useContext(AuthContext)
    const messageRef = useRef()
    useEffect(() => {
        const messageH = messageRef?.current?.getClientRects()[0].height;
        const parentH = messageRef?.current?.parentElement.getClientRects()[0].height;
        if (parentH <= messageH) messageRef.current.parentElement.scrollBy(0, messageH - parentH)
    }, [messages])
    return (
        <VStack w={"full"} flex={"1 1 0"} p={4}>
            <VStack w={"full"} flex={"1 1 0"} overflowY={"auto"} scrollBehavior={"smooth"} gap={4}>
                <VStack w={"full"} ref={messageRef}>
                    {messages.length && messages.filter(m => m.pinnedBy.includes(user._id)).map((m, i) => <Message key={i} message={m} />)}
                </VStack>
            </VStack>
        </VStack>
    )
}

export default Pins