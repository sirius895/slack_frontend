import { useRoutes } from "react-router-dom"

import SignIn from "../pages/auth/SignIn"
import NotFound from "../pages/NotFound"
import SignUp from "../pages/auth/SignUp"
import Icons from "../pages/Icons"
import Layout from "../layouts"
import Main from "../components/main/Main"
import SocketProvider from "../providers/SocketProvider"

const routes = [
    { path: "/", element: < SignIn /> },
    { path: "/signup", element: < SignUp /> },
    {
        path: "/chatting/:page/:channel/:message", element: <SocketProvider><Layout /></SocketProvider>, children: [{
            path: "", element: <Main />
        }]
    },
    { path: "/icons", element: < Icons /> },
    { path: "*", element: < NotFound /> }
]

const AppRoutes = () => {
    const _routes = useRoutes(routes)
    return _routes
}

export default AppRoutes