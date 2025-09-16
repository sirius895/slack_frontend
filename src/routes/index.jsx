import { useRoutes } from "react-router-dom"

import Pages from "../pages"
// import Auth from "../pages/auth"
// import Main from "../pages/Main"
import Layout from "../layouts"
// // import SignIn from "../pages/auth/SignIn"
// // import SignUp from "../pages/auth/SignUp"
// import Icons from "../pages/Icons"
// import NotFound from "../pages/NotFound"
import SocketProvider from "../providers/SocketProvider"

const routes = [
    { path: "/", element: < Pages.Auth.SignIn /> },
    { path: "/signup", element: < Pages.Auth.SignUp /> },
    {
        path: "/chatting/:page/:channel/:message", element: <SocketProvider><Layout /></SocketProvider>, children: [{
            path: "", element: <Pages.Main />
        }]
    },
    { path: "/icons", element: < Pages.Icons /> },
    { path: "*", element: < Pages.NotFound /> }
]

const AppRoutes = () => {
    const _routes = useRoutes(routes)
    return _routes
}

export default AppRoutes