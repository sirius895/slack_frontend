import { ChakraProvider } from "@chakra-ui/react";
import QueryProvider from "./providers/QueryProvider";
import SocketProvider from "./providers/SocketProvider";
import { ToastContainer } from "react-toastify";

import AppRoutes from "./routes";
import "./App.css";

const App = () => {
  return (
    <ChakraProvider>
      <QueryProvider>
        <SocketProvider>
          <AppRoutes />
          <ToastContainer />
        </SocketProvider>
      </QueryProvider>
    </ChakraProvider>
  );
}

export default App;
