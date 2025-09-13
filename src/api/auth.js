import api from "../libs/axios";
import toast from "../utils/toast"

export const signIn = async (data, navigate) => {
    try {
        const res = await api.post("/auth/signin", data)
        if (!res.data.payload.status) throw new Error()
        const token = res.data.token;
        localStorage.setItem("token", token)
        navigate("/@/@")
    } catch (error) {
        toast.error("SignIn failed")
    }
}

export const signUp = async (data, navigate) => {
    try {
        const res = await api.post("/auth/signup", data);
        const status = res.data.payload.status
        if (!status) throw new Error()
        navigate("/")
    } catch (error) {
        toast.error("SignUp failed")
    }
}