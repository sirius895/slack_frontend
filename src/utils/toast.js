import { toast as showToast } from "react-toastify";

const toast = {
    INFO: (message) => showToast(message, { type: 'info', theme: "colored", position: "bottom-right" }),
    SUCCESS: (message) => showToast(message, { type: 'success', theme: "colored", position: "bottom-right" }),
    WARNING: (message) => showToast(message, { type: 'warning', theme: "colored", position: "bottom-right" }),
    ERROR: (message) => showToast(message, { type: 'error', theme: "colored", position: "bottom-right" }),
}

export default toast;
