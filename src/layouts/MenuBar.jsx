import { VStack } from "@chakra-ui/react"
import ChannelList from "../components/navitems/ChannelList"
import DMList from "../components/navitems/DMList"

const MenuBar = () => {
    return (
        <VStack minW={"var(--menuW)"} h={"calc(100vh - var(--headerH))"} color={"white"} bg={"var(--secondaryColor)"} rounded={"16px 0 0 16px"} gap={4} paddingBlock={4} overflowY={"auto"}>
            <ChannelList />
            <DMList />
        </VStack>
    )
}

export default MenuBar