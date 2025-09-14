import { HStack, VStack } from "@chakra-ui/react"
import { Outlet } from "react-router-dom"
import Header from "./Header"
import MenuBar from "./MenuBar"
import SideBar from "./SideBar"

const Layout = () => {
    return (
        <VStack w={"full"} h={"100vh"} gap={0}>
            <Header />
            <HStack w={"full"} flexGrow={1} gap={0} style={{ margin: 0 }} color={"white"} bg={"var(--mainColor)"} pr={2}>
                <SideBar />
                <MenuBar />
                <Outlet />
            </HStack>
        </VStack>
    )
}

export default Layout