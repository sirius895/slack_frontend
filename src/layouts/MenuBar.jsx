import { HStack, VStack, Text } from "@chakra-ui/react"
import ChannelList from "../components/ChannelList"

const MenuBar = () => {
    return (
        <VStack w={"var(--menuW)"} h={"calc(100vh - var(--headerH))"} bg={"var(--secondaryColor)"} rounded={"8px 0 0 8px"} paddingBlock={4} overflowY={"auto"}>
            <ChannelList />
        </VStack>
    )
}

export default MenuBar