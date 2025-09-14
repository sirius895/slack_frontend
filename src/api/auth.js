import api from "../libs/axios";
import toast from "../utils/toast"
import resState from "../constants/resState";

export const signIn = async (data, navigate) => {
    try {
        const res = await api.post("/auth/signin", data)
        const status = res.data.status;
        const message = res.data.message;
        toast[status](message)
        const token = res.data.payload;
        localStorage.setItem("token", token)
        const nextURL = sessionStorage.nextURL;
        if (nextURL) { navigate(nextURL); return; }
        navigate("/chatting/home/@/@")
    } catch (error) {
        console.log(error);

        toast.ERROR("SignIn failed")
    }
}

export const signUp = async (data, navigate) => {
    try {
        // const formData = new FormData()
        // for (const key in data) {
        //     formData.append(key, data[key])
        // }
        // const res = await api.post("/auth/signup", formData, { headers: { "Content-Type": "multipart/form-data" } });
        const res = await api.post("/auth/signup", data);
        const status = res.data.status;
        const message = res.data.message;
        toast[status](message);
        if (status !== resState.SUCCESS) return;
        navigate("/")
    } catch (error) {
        toast.ERROR("SignUp failed")
    }
}

export const tokenVerify = async (token) => {
    const res = await api.get('/auth/verify', { headers: { Authorization: token } });
    return res.data.payload;
}