import { HStack, Text, VStack } from "@chakra-ui/react"
import { useContext, useMemo, useState } from "react"
import { AiFillPushpin } from "react-icons/ai"
import { FaCommentDots, FaRegSmile, FaTrash } from "react-icons/fa"
import { useNavigate, useParams } from "react-router-dom"
import { METHODS, TYPES } from "../../constants/chat"
import { AuthContext } from "../../providers/AuthProvider"
import { SocketContext } from "../../providers/SocketProvider"
import { formatTime } from "../../utils/time"
import Emoticon from "./Emoticon"
import Emoticons from "./Emoticons"
import UserAvatar from "./UserAvatar"

const Message = (props) => {
    const { message, ...etcProps } = props
    const { user } = useContext(AuthContext)
    const { socket, setShowThread } = useContext(SocketContext)
    const [toolShow, setToolShow] = useState(false)
    const [emoShow, setEmoShow] = useState(false)
    const navigate = useNavigate()
    const { channel } = useParams()

    const handleDelete = (_id) => {
        socket.emit(`${TYPES.MESSAGE}_${METHODS.DELETE}`, _id)
    }

    const handleEmos = (code) => {
        socket.emit(`${TYPES.MESSAGE}_${METHODS.HANDLE_EMOS}`, { messageID: message._id, code })
    }

    const handlePin = () => {
        const pinnedBy = message.pinnedBy.includes(user._id) ? message.pinnedBy.filter(m => m._id) : [...message.pinnedBy, user._id]
        socket.emit(`${TYPES.MESSAGE}_${METHODS.UPDATE}`, { _id: message._id, pinnedBy })
    }

    const emoticons = useMemo(() => {
        return message.emoticons.reduce((prev, emoticon) => {
            const group = prev.some(prev => prev.code === emoticon.code);
            if (!group) { return [...prev, { code: emoticon.code, users: [emoticon.sender] }]; }
            return prev.map(group => {
                if (group.code === emoticon.code) {
                    return {
                        code: emoticon.code,
                        users: [...group.users, emoticon.sender],
                    }
                }
                return group;
            });
        }, []);
    }, [message]);

    return (
        <HStack w={"full"} minH={"80px"} bg={"#e1dfdf8a"} rounded={"12px"} shadow={"0 0 4px"} px={4} pos={"relative"} h={"fit-content"} gap={4} py={4} pr={6} onMouseOver={() => setToolShow(true)} onMouseLeave={() => setToolShow(false)} {...etcProps}>
            <VStack w={"72px"} h={"full"} justify={'center'} alignItems={"center"}>
                <UserAvatar />
                <Text fontWeight={"extrabold"} color={"var(--mainColor)"}>{message.sender.username ? message.sender.username : "Unknown"}</Text>
            </VStack>
            <VStack flexGrow={1} h={"full"} pl={2} pt={2} justifyContent={"flex-start"}>
                <Text w={"full"} h={"50px"} fontWeight={"bold"}>{formatTime(message.createdAt)}</Text>
                <HStack w={"full"} flex={"1 1 0"} alignItems={"flex-start"}>
                    <Text w={"full"} whiteSpace={"normal"} flexWrap={"wrap"} fontFamily={"cursive"}>{message.content}</Text>
                </HStack>
                <HStack w={"full"} gap={2}>
                    {emoticons.map((emo, i) => (
                        <HStack key={i}>
                            <Emoticon key={i} id={emo.code} onClick={() => handleEmos(emo.code)} />
                            <Text>{emo.users.length}</Text>
                        </HStack>)
                    )}
                </HStack>
            </VStack>
            <VStack h={"full"} justify={"center"}>
                {message?.pinnedBy?.includes(user._id) && <AiFillPushpin size={"24px"} />}
            </VStack>
            {toolShow &&
                <HStack pos={"absolute"} shadow={"0 0 3px black"} bg={"white"} rounded={4} px={4} py={2} gap={4} top={4} right={4}>
                    <HStack gap={2} cursor={"pointer"} pos={"relative"} onMouseLeave={() => setEmoShow(false)}>
                        <FaRegSmile onClick={() => setEmoShow(!emoShow)} />
                        {emoShow && <Emoticons maxW={"250px"} pos={"absolute"} top={"100%"} right={0} handleEmos={handleEmos} />}
                        {!message.parentID &&
                            <>
                                < AiFillPushpin onClick={handlePin} />
                                <FaCommentDots onClick={() => { setShowThread(true); navigate(`/chatting/home/${channel}/${message._id}`) }} />
                            </>
                        }
                        {message.sender._id === user._id && <FaTrash onClick={() => handleDelete(message._id)} />}
                    </HStack>
                </HStack>}
        </HStack>
    )
}

export default Message