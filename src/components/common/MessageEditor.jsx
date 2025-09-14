import { HStack, Textarea, VStack } from "@chakra-ui/react"
import { useContext, useEffect, useState } from "react"
import { FaBold, FaItalic, FaPaperPlane, FaPlus } from "react-icons/fa"
import { AuthContext } from "../../providers/AuthProvider"
import { useParams } from "react-router-dom"
import { SocketContext } from "../../providers/SocketProvider"
import { METHODS, TYPES } from "../../constants/chat"

const MessageEditor = () => {
    const { user } = useContext(AuthContext)
    const { socket } = useContext(SocketContext)
    const { channel: channelID, message: messageID } = useParams()

    const initState = {
        sender: "", channelID, mentios: [],
        content: "", files: [], emoticons: [],
        pinnedBy: [], isDraft: false, parentID: null, childCount: 0
    }
    const [message, setMessage] = useState(initState);
    const changeContent = (e) => setMessage({ ...message, content: e.target.value });
    const createMessage = () => {
        console.log(message);
        socket.emit(`${TYPES.MESSAGE}_${METHODS.CREATE}`, { ...message })
    }
    const handleKeyDown = (e) => {
        if (e.code === "Enter") {
            e.preventDefault()
            createMessage()
            setMessage({ ...initState, sender: user._id, channelID })
        }
    }
    useEffect(() => {
        if (user._id) setMessage(m => ({ ...m, sender: user._id }))
    }, [user._id])
    useEffect(() => {
        if (channelID.length > 0) setMessage(m => ({ ...m, channelID }))
    }, [channelID])
    return (
        <VStack w={"full"} h={"full"} rounded={8} shadow={"0 0 3px black"}>
            <HStack w={"full"} h={"40px"} px={4} gap={2} bg={"#d7d5d596"} color={"gray"}>
                <FaBold />
                <FaItalic />
            </HStack>
            <HStack w={"full"} flex={"1 1 0"}>
                <Textarea h={"full"} resize={"none"} border={"none"} _focus={{ outline: "none" }} onChange={changeContent} onKeyDown={handleKeyDown} value={message.content} />
            </HStack>
            <HStack w={"full"} h={"40px"} justify={"space-between"} px={4} gap={2} color={"gray"}>
                <HStack>
                    <FaPlus />
                </HStack>
                <HStack>
                    <FaPaperPlane onClick={createMessage} />
                </HStack>
            </HStack>
        </VStack>
    )
}

export default MessageEditor