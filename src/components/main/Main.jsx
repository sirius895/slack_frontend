import { VStack } from "@chakra-ui/react"
import { useState } from "react"
import Files from "../tabs/Files"
import Messages from "../tabs/Messages"
import Pins from "../tabs/Pins"
import TabList from "../tabs/TabList"

const Main = () => {
    const [curTab, setCurTab] = useState("messages")
    return (
        <VStack w={"full"} h={"full"} bg={"white"} roundedRight={"8px"}>
            <TabList curTab={curTab} setCurTab={setCurTab} />
            {curTab === "messages" && <Messages />}
            {curTab === "pins" && <Pins />}
            {curTab === "files" && <Files />}
        </VStack >
    )
}

export default Main