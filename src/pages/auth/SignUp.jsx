import { Avatar, Button, FormLabel, Input, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../../api/auth";

const SignUp = () => {
    const [userInfo, setUserInfo] = useState({ username: "", email: "", password: "", confirmPassword: "" });
    const [file, setFile] = useState();
    const [avatar, setAvatar] = useState()
    const changeUserInfo = (e) => setUserInfo({ ...userInfo, [e.target.name]: e.target.value })
    const navigate = useNavigate()
    const handleSignUp = () => {
        const data = { username: userInfo.username, email: userInfo.email, password: userInfo.password, avatar: "default.gif" }
        signUp(data, navigate)
    }
    const handleAvatar = (e) => {
        const file = e.target.files[0];
        setAvatar(URL.createObjectURL(file))
        setFile(file)
    }

    return (
        <VStack w={"full"} h={"100vh"} justify={"center"} align={"center"}>
            <VStack w={"400px"} h={"600px"} rounded={"24px"} justify={"center"} align={"center"} gap={4} shadow={"0 0 8px black"} paddingInline={4}>
                <Text fontSize={24}>Sign Up</Text>
                <FormLabel>
                    <Avatar src={avatar} w={"100px"} h={"100px"} />
                    <Input type="file" display={"none"} onChange={handleAvatar}></Input>
                </FormLabel>
                <Input placeholder={"Name"} type={"text"} name="username" value={userInfo.username} onChange={changeUserInfo} />
                <Input placeholder={"Email"} type={"text"} name="email" value={userInfo.email} onChange={changeUserInfo} />
                <Input placeholder={"Password"} type={"password"} name="password" value={userInfo.password} onChange={changeUserInfo} />
                <Input placeholder={"Confirm Password"} type={"password"} name="confirmPassword" value={userInfo.confirmPassword} onChange={changeUserInfo} />
                <FormLabel display={"flex"} w={"full"} justifyContent={"space-between"}>
                    <Text textAlign={"center"}>I have already registered</Text>
                    <Link to={"/"}>Go to signin</Link>
                </FormLabel>
                <Button w={"full"} _hover={{ transform: "scaleX(1.04)" }} onClick={handleSignUp}>Sign Up</Button>
            </VStack>
        </VStack>
    )
}

export default SignUp