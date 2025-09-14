import { HStack, VStack, Text } from "@chakra-ui/react"
import ChannelList from "../components/main/ChannelList"
import DMList from "../components/main/DMList"

const MenuBar = () => {
    return (
        <VStack minW={"var(--menuW)"} h={"calc(100vh - var(--headerH))"} color={"white"} bg={"var(--secondaryColor)"} rounded={"8px 0 0 8px"} gap={4} paddingBlock={4} overflowY={"auto"}>
            <ChannelList />
            <DMList />
        </VStack>
    )
}

export default MenuBar