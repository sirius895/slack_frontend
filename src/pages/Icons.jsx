import { HStack, Text } from "@chakra-ui/react";
import * as FaIcons from "react-icons/fa";

const Icons = () => {
    return (
        <HStack flexWrap={"wrap"} gap={4}>
            {Object.keys(FaIcons).map((v, i) => {
                return (
                    <HStack key={i} w={"300px"}>
                        <Text>{v}</Text>
                        {FaIcons[v]()}
                    </HStack>
                )
            })}
        </HStack>
    )
}

export default Icons