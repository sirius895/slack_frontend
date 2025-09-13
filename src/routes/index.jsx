import { useRoutes } from "react-router-dom"

import SignIn from "../pages/auth/SignIn"
import NotFound from "../pages/NotFound"
import SignUp from "../pages/auth/SignUp"
import Icons from "../pages/Icons"

const routes = [
    { path: "/", element: < SignIn /> },
    { path: "/signup", element: < SignUp /> },
    { path: "/icons", element: < Icons /> },
    { path: "*", element: < NotFound /> }
]

const AppRoutes = () => {
    const _routes = useRoutes(routes)
    return _routes
}

export default AppRoutes