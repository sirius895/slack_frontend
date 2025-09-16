import { Avatar, HStack } from "@chakra-ui/react";
import StateShow from "./StateShow";

const UserAvatar = (props) => {
    const { url: _url, w = "56px", h = "56px", state = 0, showState = false, borderColor, ...etcProps } = props
    let url = `${process.env.REACT_APP_BASE_URL}/avatars/${_url ? _url : "default.gif"}`;
    
    return (
        <HStack w={w} h={h} pos={"relative"}>
            <Avatar src={url} w={"full"} h={"full"} {...etcProps} />
            {showState && <StateShow w={"32%"} h={"32%"} pos={'absolute'} right={"10%"} bottom={"10%"} state={state} borderColor={borderColor} />}
        </HStack>
    )
}

export default UserAvatar