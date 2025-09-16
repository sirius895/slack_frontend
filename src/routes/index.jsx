import { useRoutes } from "react-router-dom"

import Auth from "../pages/auth"
import Main from "../components/main/Main"
import Layout from "../layouts"
// import SignIn from "../pages/auth/SignIn"
// import SignUp from "../pages/auth/SignUp"
import Icons from "../pages/Icons"
import NotFound from "../pages/NotFound"
import SocketProvider from "../providers/SocketProvider"

const routes = [
    { path: "/", element: < Auth.SignIn /> },
    { path: "/signup", element: < Auth.SignUp /> },
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