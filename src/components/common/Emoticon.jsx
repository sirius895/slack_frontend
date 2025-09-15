import { Box } from "@chakra-ui/react";
import { useMemo } from "react";
import { emoticons } from "../../constants/emoticons";

const Emoticon = ({ id, ...props }) => {
    const icon = useMemo(() => emoticons.find((emoticon) => String(emoticon.id) === String(id))?.icon, [id])
    return <Box cursor={"pointer"} {...props}>{icon}</Box>
}

export default Emoticon;
