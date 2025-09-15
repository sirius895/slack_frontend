import { HStack } from "@chakra-ui/react";

const StateShow = (props) => {
    const colors = ["red", "gray", "yellow", "green.400"]
    const { w = "12px", h = "12px", state = 0, borderColor, ...etcProps } = props
    return (
        <HStack w={w} h={h} rounded={"full"} {...etcProps} bg={colors[state]} border={`2px solid ${borderColor ? borderColor : "black"}`} />
    )
}

export default StateShow