import { HStack, Input } from "@chakra-ui/react"
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa"

const Header = () => {
    return (
        <HStack w={"full"} h={"var(--headerH)"} gap={4} bg={"var(--mainColor)"} color={"#4e4646ff"} justify={"center"}>
            <HStack><FaArrowLeft color={"var(--fontColor)"} /></HStack>
            <HStack><FaArrowRight color={"var(--fontColor)"} /></HStack>
            <HStack maxW={"400px"} w={"40%"} border={"2px solid var(--secondaryColor)"} rounded={"8px"} pr={4} >
                <Input color={"white"} border={"none"} _focus={{ outline: "none" }} h={"36px"} />
                <FaSearch color={"var(--fontColor)"} />
            </HStack>
        </HStack>
    )
}

export default Header