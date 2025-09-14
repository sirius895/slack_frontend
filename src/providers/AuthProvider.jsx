import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { tokenVerify } from "../api/auth";
import { authRouter, whiteList } from "../constants/urls";

export const AuthContext = createContext({
    user: { _id: "", username: "", email: "", avatar: "" },
    setUser: () => { }
})

const AuthProvider = (props) => {
    const [user, setUser] = useState({ _id: "", username: "", email: "", avatar: "" });
    const value = { user, setUser };
    const href = window.location.pathname;

    const navigate = useNavigate();
    const goToPage = (url) => {
        if (!url) navigate("/")
        else navigate(url)
    }
    useEffect(() => {
        (async () => {
            if (!authRouter.includes(href)) sessionStorage.setItem("nextURL", href)
            try {
                const _user = await tokenVerify(localStorage.token)
                setUser(_user)
                goToPage(sessionStorage.nextURL ? sessionStorage.nextURL : "/chatting/home/@/@")
            } catch (error) {
                if (whiteList.includes(href)) { goToPage(href); return; }
                goToPage("/")
            }
        })()
    }, [href])

    return (
        <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
    )
}

export default AuthProvider