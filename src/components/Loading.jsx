import { Flex, Spinner, Text } from "@chakra-ui/react"

const Loading = () => {
    return (
        <Flex w={"full"} h={"100vh"} justify={"center"} align={"center"} bg={"var(--mainColor)"}>
            <Flex justify={"center"} align={"center"} pos={"relative"}>
                <Spinner position={"absolute"} thickness={2} size={"xl"} p={"96px"} color={"#c1abff"} speed="1.6s" />
                <Spinner position={"absolute"} thickness={2} size={"xl"} p={"88px"} color={"#8e6ae1"} speed="1.2s" />
                <Spinner position={"absolute"} thickness={2} size={"xl"} p={"80px"} color={"#714ac9"} speed="1.0s" />
                <Text fontFamily={"cursive"} fontWeight={"extrabold"} pos={"absolute"} color={"var(--fontColor)"}>Loading...</Text>
            </Flex>
        </Flex>
    )
}

export default Loading;