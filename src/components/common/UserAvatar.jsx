import { Avatar, border, HStack } from "@chakra-ui/react";
import StateShow from "./StateShow";

const UserAvatar = (props) => {
    const { url: _url, w = "56px", h = "56px", state = 0, showState = false, borderColor, ...etcProps } = props
    let url = `${process.env.REACT_APP_BASE_URL}/avatars/${_url ? _url : "default.gif"}`;
    return (
        <HStack w={"fit-content"} h={"fit-content"} pos={"relative"}>
            <Avatar src={url} w={w} h={h} {...etcProps} />
            {showState && <StateShow pos={'absolute'} right={1} bottom={1} state={state} borderColor={borderColor} />}
        </HStack>
    )
}

export default UserAvatar