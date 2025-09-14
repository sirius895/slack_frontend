import { createRoot } from "react-dom/client";
import 'react-toastify/dist/ReactToastify.css';
import "./index.css";
import App from "./App";

const root = createRoot(document.getElementById("root")).render(
  <App />
);

export default root;
