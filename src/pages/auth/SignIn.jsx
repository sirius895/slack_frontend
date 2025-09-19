import { Button, Checkbox, FormLabel, HStack, Input, Text, VStack } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signIn } from "../../api/auth";

const SignIn = () => {
  const [userInfo, setUserInfo] = useState({ email: "", password: "" });
  const changeUserInfo = (e) => setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  const navigate = useNavigate();
  const handleSignIn = useCallback(() => {
    (async () => await signIn(userInfo, navigate))();
  }, [userInfo, navigate]);

  return (
    <HStack w={"full"} h={"100vh"} bg={"var(--mainColor)"} justify={"center"} align={"center"} color={"white"}>
      <VStack
        maxW={"400px"}
        w={"50%"}
        h={"90%"}
        maxH={"560px"}
        bg={"var(--secondaryColor)"}
        rounded={"24px"}
        justify={"center"}
        align={"center"}
        gap={4}
        shadow={"0 0 8px black"}
        px={8}
      >
        <Text fontSize={24}>Please Sign In</Text>
        <Input bg={"transparent"} placeholder={"Email"} type={"text"} name="email" value={userInfo.email} onChange={changeUserInfo} />
        <Input bg={"transparent"} placeholder={"Password"} type={"password"} name="password" value={userInfo.password} onChange={changeUserInfo} />
        <HStack w={"full"} justify={"flex-start"}>
          <FormLabel display={"flex"}>
            <Checkbox pr={4} />
            <Text textAlign={"center"}>Remember Me</Text>
          </FormLabel>
        </HStack>
        <HStack w={"full"} justify={"flex-start"}>
          <FormLabel display={"flex"} w={"full"} justifyContent={"space-between"}>
            <Text textAlign={"center"}>Don't you have your account</Text>
            <Link to={"/signup"}>Go to signup</Link>
          </FormLabel>
        </HStack>
        <Button w={"full"} bg={"var(--mainColor)"} shadow={"0 0 4px"} _hover={{ transform: "scaleX(1.04)" }} onClick={handleSignIn}>
          Sign In
        </Button>
      </VStack>
    </HStack>
  );
};

export default SignIn;
