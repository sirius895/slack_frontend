// import { createRoot } from "react-dom/client";
import ReactDOM from "react-dom/client";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import App from "./App";

// const root = createRoot(document.getElementById("root")).render(
//   <App />
// );

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
