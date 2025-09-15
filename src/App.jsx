import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AuthProvider from "./providers/AuthProvider";
import QueryProvider from "./providers/QueryProvider";

import "./App.css";
import AppRoutes from "./routes";

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
