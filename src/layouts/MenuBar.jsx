import { HStack, VStack, Text } from "@chakra-ui/react"

const MenuBar = () => {
    return (
        <VStack w={"var(--menuW)"} h={"full"} bg={"var(--secondaryColor)"} rounded={"8px 0 0 8px"}>
            <Text>MenuBar</Text>
        </VStack>
    )
}

export default MenuBar