import { HStack, VStack, Text } from "@chakra-ui/react"
import { useContext, useState } from "react"
import { FaCaretDown, FaCaretRight } from "react-icons/fa"
import { SocketContext } from "../providers/SocketProvider"

const ChannelList = () => {
    const [showCh, setShowCh] = useState(true)
    const [channels, setChannels] = useState([])
    const { socket } = useContext(SocketContext)
    return (
        <VStack w={"full"} paddingInline={2}>
            <HStack w={"full"} onClick={() => setShowCh(!showCh)}>
                {showCh ? <FaCaretDown /> : <FaCaretRight />}
                <Text>Channels</Text>
            </HStack>
            <VStack></VStack>
        </VStack>
    )
}

export default ChannelList