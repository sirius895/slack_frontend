import { HStack, Text, VStack } from "@chakra-ui/react"
import { useContext, useState } from "react"
import { FaRegSmile, FaTrash } from "react-icons/fa"
import { METHODS, TYPES } from "../../constants/chat"
import { AuthContext } from "../../providers/AuthProvider"
import { SocketContext } from "../../providers/SocketProvider"
import UserAvatar from "./UserAvatar"
import Emoticon from "./Emoticon"
import Emoticons from "./Emoticons"

const Message = (props) => {
    const { message } = props
    const { user } = useContext(AuthContext)
    const { socket } = useContext(SocketContext)
    const [toolShow, setToolShow] = useState(false)
    const [emoShow, setEmoShow] = useState(false)

    const deleteMessage = (_id) => {
        socket.emit(`${TYPES.MESSAGE}_${METHODS.DELETE}`, _id)
    }

    const handleEmos = (code) => {
        socket.emit(`${TYPES.MESSAGE}_${METHODS.HANDLE_EMOS}`, { messageID: message._id, code })
    }

    return (
        <HStack w={"full"} minH={"80px"} pos={"relative"} h={"fit-content"} py={4} onMouseOver={() => setToolShow(true)} onMouseLeave={() => setToolShow(false)}>
            <VStack w={"72px"} h={"full"} justify={'center'} alignItems={"center"}>
                <UserAvatar />
                <Text>
                    {message.sender.username ? message.sender.username : "Unknown"}
                </Text>
            </VStack>
            <VStack flexGrow={1} h={"full"} pl={2} pt={2} justifyContent={"flex-start"}>
                <HStack w={"full"} flex={"1 1 0"} alignItems={"flex-start"}>
                    <Text w={"full"} whiteSpace={"normal"} flexWrap={"wrap"}>{message.content}</Text>
                </HStack>
                <HStack w={"full"} >
                    {message.emoticons.map((emo, i) => {
                        return (
                            <Emoticon key={i} id={emo.code} onClick={() => handleEmos(emo.code)} />
                        )
                    })}
                </HStack>
            </VStack>
            {toolShow &&
                <HStack pos={"absolute"} shadow={"0 0 3px black"} rounded={4} px={4} py={2} gap={2} top={4} right={4}>
                    <HStack gap={2} cursor={"pointer"}>
                        <HStack pos={"relative"} onMouseLeave={() => setEmoShow(false)}>
                            <FaRegSmile onClick={() => setEmoShow(!emoShow)} />
                            {emoShow && <Emoticons maxW={"250px"} pos={"absolute"} top={"100%"} right={0} handleEmos={handleEmos} />}
                        </HStack>
                    </HStack>
                    {message.sender._id === user._id && <FaTrash onClick={() => deleteMessage(message._id)} />}
                </HStack>}
        </HStack>
    )
}

export default Message