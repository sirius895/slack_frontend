import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import "./index.css";
import App from "./App";

const root = createRoot(document.getElementById("root")).render(
  <Router>
    <App />
  </Router>
);

export default root;
