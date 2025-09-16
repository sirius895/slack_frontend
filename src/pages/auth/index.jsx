import React from "react";

const SignUp = React.lazy(() => import("./SignUp"));
const SignIn = React.lazy(() => import("./SignIn"));

const Auth = { SignIn, SignUp }

export default Auth;