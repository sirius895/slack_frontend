import { HStack, Textarea, VStack } from "@chakra-ui/react"
import { useContext, useEffect, useState } from "react"
import { FaBold, FaItalic, FaPaperPlane, FaPlus, FaRegSmile } from "react-icons/fa"
import { useParams } from "react-router-dom"
import { METHODS, TYPES } from "../../constants/chat"
import { AuthContext } from "../../providers/AuthProvider"
import { SocketContext } from "../../providers/SocketProvider"
import Emoticon from "./Emoticon"
import Emoticons from "./Emoticons"

const MessageEditor = ({ isForThread }) => {
    const { user } = useContext(AuthContext)
    const { socket } = useContext(SocketContext)
    const { channel: channelID, message: messageID } = useParams()
    const [emoShow, setEmoShow] = useState(false)

    const initState = {
        sender: "", channelID, mentios: [],
        content: "", files: [], emoticons: [],
        pinnedBy: [], isDraft: false, parentID: /* isForThread ? messageID : */ null, childCount: 0
    }
    const [message, setMessage] = useState(initState);
    const changeContent = (e) => setMessage({ ...message, content: e.target.value });

    const createMessage = () => {
        socket.emit(`${TYPES.MESSAGE}_${METHODS.CREATE}`, { ...message })
    }

    const handleKeyDown = (e) => {
        if (e.code === "Enter") {
            e.preventDefault()
            createMessage()
            setMessage({ ...initState, sender: user._id, channelID })
        }
    }

    const handleEmos = (code) => {
        setMessage(msg => ({
            ...msg,
            emoticons: msg.emoticons.find(emo => emo.code === code)
                ? msg.emoticons.filter(emo => emo.code !== code)
                : [...msg.emoticons, { sender: user._id, code }]
        }))
    }

    const removeEmos = (no) => {
        setMessage(msg => ({ ...msg, emoticons: msg.emoticons.filter((m, i) => i !== no) }))
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
            <HStack w={"full"} px={4}>
                {message.emoticons.map((emo, i) => {
                    return (
                        <Emoticon key={i} id={emo.code} onClick={() => removeEmos(i)} />
                    )
                })}
            </HStack>
            <HStack w={"full"} h={"40px"} justify={"space-between"} px={4} gap={2} color={"gray"}>
                <HStack gap={2} cursor={"pointer"}>
                    <FaPlus />
                    <HStack pos={"relative"} onMouseLeave={() => setEmoShow(false)}>
                        <FaRegSmile onClick={() => setEmoShow(!emoShow)} />
                        {emoShow && <Emoticons maxW={"200px"} pos={"absolute"} bottom={"100%"} left={0} handleEmos={handleEmos} />}
                    </HStack>
                </HStack>
                <HStack>
                    <FaPaperPlane onClick={createMessage} />
                </HStack>
            </HStack>
        </VStack>
    )
}

export default MessageEditor