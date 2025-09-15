import { VStack, Text, HStack, list } from "@chakra-ui/react"
import { useContext, useEffect, useState } from "react";
import * as FaIcons from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import UserAvatar from "../components/common/UserAvatar";
import { SocketContext } from "../providers/SocketProvider";
import { METHODS, TYPES } from "../constants/chat";
import { AuthContext } from "../providers/AuthProvider";
import toast from "../utils/toast";

const SideBar = () => {
    const navigate = useNavigate();
    const [setActivatedItem] = useState("HOME");
    const { socket } = useContext(SocketContext)
    const { user, setUser } = useContext(AuthContext)
    const [showStateBar, setShowStateBar] = useState(false)
    const pageNavigate = (url, key) => {
        navigate(url)
        setActivatedItem(key)
    }
    const sideItems = [{ label: "HOME", icon: FaIcons.FaHome, key: "home" }]
    const states = [
        { label: "Sleep", state: 1 },
        { label: "Online", state: 2 },
        { label: "Sign Out", state: 0 },
    ]
    const changeState = (state) => {
        console.log(state);

        socket.emit(`${TYPES.AUTH}_${METHODS.UPDATE}`, { state })
    }
    const handleSignOut = () => {
        localStorage.removeItem("token");
        navigate("/");
        sessionStorage.removeItem("nextURL")
    }

    const listenChangeState = (status, data) => {
        console.log(data);

        if (status && data) setUser(data)
        else toast.ERROR(data.message)
    }
    useEffect(() => {
        socket.on(`${TYPES.AUTH}_${METHODS.UPDATE}`, listenChangeState)
        socket.on('broadcast', (status, data) => console.log(data))
        return () => socket.removeListener(`${TYPES.AUTH}_${METHODS.UPDATE}`, listenChangeState)
    }, [])
    console.log(user.state);

    return (
        <VStack minW={"var(--sideW)"} h={"full"} color={"white"} paddingBlock={4} bg={"var(--mainColor)"} justify={"space-between"}>
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
            <HStack pos={"relative"} onMouseOver={() => setShowStateBar(true)} onMouseLeave={() => setShowStateBar(false)}>
                <UserAvatar w={"40px"} h={"40px"} state={user.state} showState={true} borderColor={"var(--mainColor)"} />
                {showStateBar && <VStack w={"120px"} rounded={8} pos={"absolute"} py={2} bottom={"100%"} left={0} bg={"var(--mainColor)"} shadow={"0 0 3px black"}>
                    {states.map((s, i) => {
                        return <HStack key={i} w={"full"} onClick={i === 2 ? handleSignOut : () => changeState(s.state)} p={2} cursor={"pointer"} _hover={{ backgroundColor: "var(--secondaryColor)" }}>
                            <Text>{s.label}</Text>
                        </HStack>
                    })}
                </VStack>}
            </HStack>
        </VStack>
    )
}

export default SideBar