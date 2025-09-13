import { toast as showToast } from "react-toastify";

const toast = {
    info: (message) => showToast(message, { type: 'info', theme: "colored", position: "bottom-right" }),
    success: (message) => showToast(message, { type: 'success', theme: "colored", position: "bottom-right" }),
    warning: (message) => showToast(message, { type: 'warning', theme: "colored", position: "bottom-right" }),
    error: (message) => showToast(message, { type: 'error', theme: "colored", position: "bottom-right" }),
}

export default toast;
