import { Avatar, HStack } from "@chakra-ui/react";

const UserAvatar = (props) => {
    const { url: _url, w = "56px", h = "56px", ...etcProps } = props
    let url = `${process.env.REACT_APP_BASE_URL}/avatars/${_url ? _url : "default.gif"}`;
    return (
        <HStack>
            <Avatar src={url} w={w} h={h} {...etcProps} />
        </HStack>
    )
}

export default UserAvatar