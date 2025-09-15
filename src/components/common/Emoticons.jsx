import { HStack } from "@chakra-ui/react";
import { emoticons } from "../../constants/emoticons";
import Emoticon from "./Emoticon";

const Emoticons = (props) => {
    const { handleEmos, ...etcProps } = props

    return (
        <HStack flexWrap={"wrap"} w={"300px"} rounded={4} bg={"white"} shadow={"0 0 3px black"} p={2} {...etcProps}>
            {emoticons.map(emoticon => (
                <Emoticon
                    key={emoticon.id}
                    id={emoticon.id}
                    cursor='pointer'
                    onClick={() => handleEmos?.(emoticon.id)}
                />
            ))}
        </HStack>
    )
}

export default Emoticons;
