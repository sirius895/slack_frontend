import { Button, Input, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../../api/auth";

const SignUp = () => {
    const [userInfo, setUserInfo] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const changeUserInfo = (e) => setUserInfo({ ...userInfo, [e.target.name]: e.target.value })
    const navigate = useNavigate()

    return (
        <VStack w={"full"} h={"100vh"} justify={"center"} align={"center"}>
            <VStack w={"400px"} h={"500px"} rounded={"24px"} justify={"center"} align={"center"} gap={8} shadow={"0 0 8px black"} paddingInline={4}>
                <Text fontSize={24}>Please Sign In</Text>
                <Input placeholder={"Name"} type={"text"} name="name" value={userInfo.name} onChange={changeUserInfo} />
                <Input placeholder={"Email"} type={"text"} name="email" value={userInfo.email} onChange={changeUserInfo} />
                <Input placeholder={"Password"} type={"password"} name="password" value={userInfo.password} onChange={changeUserInfo} />
                <Input placeholder={"Confirm Password"} type={"password"} name="confirmPassword" value={userInfo.confirmPassword} onChange={changeUserInfo} />
                <Button w={"full"} _hover={{ transform: "scaleX(1.04)" }} onClick={() => signUp(userInfo, navigate)}>Sign Up</Button>
            </VStack>
        </VStack>
    )
}

export default SignUp