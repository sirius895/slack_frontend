import React from "react"
import Auth from "./auth";

const Main = React.lazy(() => import("./Main"));
const Icons = React.lazy(() => import("./Icons"));
const NotFound = React.lazy(() => import("./NotFound"));

const Pages = { Auth, Main, Icons, NotFound }

export default Pages