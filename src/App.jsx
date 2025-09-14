import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router } from "react-router-dom";
import QueryProvider from "./providers/QueryProvider";
import SocketProvider from "./providers/SocketProvider";
import { ToastContainer } from "react-toastify";
import AuthProvider from "./providers/AuthProvider";

import AppRoutes from "./routes";
import "./App.css";

const App = () => {
  return (
    <Router>
      <ChakraProvider>
        <AuthProvider>
          <QueryProvider>
            <AppRoutes />
            <ToastContainer />
          </QueryProvider>
        </AuthProvider>
      </ChakraProvider>
    </Router>
  );
}

export default App;
