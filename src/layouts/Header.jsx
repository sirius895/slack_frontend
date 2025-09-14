import { HStack, Text } from "@chakra-ui/react"

const Header = () => {
    return (
        <HStack w={"full"} h={"var(--headerH)"} bg={"var(--mainColor)"} color={"#ffffff"}><Text>Header</Text></HStack>
    )
}

export default Header