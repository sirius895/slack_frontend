import { HStack, VStack, Text } from "@chakra-ui/react"
import ChannelList from "../components/ChannelList"

const MenuBar = () => {
    return (
        <VStack w={"var(--menuW)"} h={"full"} bg={"var(--secondaryColor)"} rounded={"8px 0 0 8px"} paddingBlock={4}>
            <ChannelList />
        </VStack>
    )
}

export default MenuBar