import { ChakraProvider } from "@chakra-ui/react";
import { Suspense } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AuthProvider from "./providers/AuthProvider";
import QueryProvider from "./providers/QueryProvider";

import "./App.css";
import Loading from "./components/Loading";
import AppRoutes from "./routes";

const App = () => {
  return (
    <Suspense fallback={<Loading />}>
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
    </Suspense>
  );
}

export default App;
