import { VStack, Text, HStack } from "@chakra-ui/react"
import { useState } from "react";
import * as FaIcons from "react-icons/fa"
import { useNavigate } from "react-router-dom"

const SideBar = () => {
    const navigate = useNavigate();
    const [activatedItem, setActivatedItem] = useState("HOME");
    const pageNavigate = (url, key) => {
        console.log("hell;");

        navigate(url)
        setActivatedItem(key)
    }
    const sideItems = [
        { label: "HOME", icon: FaIcons.FaHome, key: "home" }
    ]
    return (
        <VStack minW={"var(--sideW)"} h={"full"} color={"white"} paddingBlock={4} bg={"var(--mainColor)"}>
            {
                sideItems.map((v, i) => {
                    return (
                        <VStack key={i} w={"fit-content"} h={"fit-content"}>
                            <HStack w={"40px"} h={"40px"} rounded={"8px"} bg={"var(--activeColor)"} justify={"center"} items={"center"}>
                                {v.icon({ size: "20px", onClick: () => pageNavigate(`/chatting/${v.key}/@/@`) })}
                            </HStack>
                            <Text fontSize={12}>{v.label}</Text>
                        </VStack>
                    )
                })
            }
        </VStack>
    )
}

export default SideBar