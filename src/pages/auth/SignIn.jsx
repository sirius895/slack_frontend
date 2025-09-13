import { Button, Checkbox, FormLabel, HStack, Input, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { signIn } from "../../api/auth";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const [userInfo, setUserInfo] = useState({ email: "", password: "" });
    const changeUserInfo = (e) => setUserInfo({ ...userInfo, [e.target.name]: e.target.value })
    const navigate = useNavigate()

    return (
        <VStack w={"full"} h={"100vh"} justify={"center"} align={"center"}>
            <VStack w={"400px"} h={"500px"} rounded={"24px"} justify={"center"} align={"center"} gap={8} shadow={"0 0 8px black"} paddingInline={4}>
                <Text fontSize={24}>Please Sign In</Text>
                <Input placeholder={"Email"} type={"text"} name="email" value={userInfo.email} onChange={changeUserInfo} />
                <Input placeholder={"Password"} type={"password"} name="password" value={userInfo.password} onChange={changeUserInfo} />
                <HStack w={"full"} justify={"flex-start"}>
                    <FormLabel display={"flex"}>
                        <Checkbox pr={4} />
                        <Text textAlign={"center"}>Remember Me</Text>
                    </FormLabel>
                </HStack>
                <Button w={"full"} _hover={{ transform: "scaleX(1.04)" }} onClick={() => signIn(userInfo, navigate)}>Sign In</Button>
            </VStack>
        </VStack>
    )
}

export default SignUp