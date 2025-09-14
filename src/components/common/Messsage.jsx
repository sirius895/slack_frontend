import { HStack, Text, VStack } from "@chakra-ui/react"
import { useContext, useState } from "react"
import { FaTrash } from "react-icons/fa"
import { METHODS, TYPES } from "../../constants/chat"
import { SocketContext } from "../../providers/SocketProvider"
import UserAvatar from "./UserAvatar"

const Message = (props) => {
    const { message } = props
    const [toolShow, setToolShow] = useState(false)
    const { socket } = useContext(SocketContext)
    const deleteMessage = (_id) => {
        socket.emit(`${TYPES.MESSAGE}_${METHODS.DELETE}`, _id)
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
                <HStack w={"full"} >
                    <Text w={"full"} whiteSpace={"normal"} flexWrap={"wrap"}>{message.content}</Text>
                </HStack>
            </VStack>
            {toolShow && <HStack pos={"absolute"} gap={2} top={4} right={4}>
                <FaTrash onClick={() => deleteMessage(message._id)} />
            </HStack>}
        </HStack>
    )
}

export default Message