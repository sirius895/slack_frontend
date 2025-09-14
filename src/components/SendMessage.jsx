import { Button, Flex, Textarea } from "@chakra-ui/react";
import { useContext, useRef, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { METHOD, REQUEST } from "../constants/chat";
import { SocketContext } from "../providers/SocketProvider";

const SendMessage = ({ isEditing, channelId, messageId, value, onClose }) => {
    const { socket } = useContext(SocketContext);
    const [message, setMessage] = useState(value);
    const isTyping = useRef(false);

    const handleSend = () => {
        if (isEditing) {
            socket.emit(
                `${REQUEST.MESSAGE}_${METHOD.UPDATE}`,
                {
                    id: messageId,
                    message: { message },
                }
            );
        } else {
            socket.emit(
                `${REQUEST.MESSAGE}_${METHOD.CREATE}`,
                {
                    channel: channelId,
                    parent: messageId,
                    message,
                }
            );
            setMessage('');
        }
        onClose?.();
    }

    const handleTyping = () => {
        if (isTyping.current)
            return;

        isTyping.current = true;

        socket.emit(REQUEST.TYPING, {
            channelId,
            messageId,
        });

        setTimeout(() => {
            isTyping.current = false;
        }, 2500);
    }

    return (
        <Flex p={4} gap={4}>
            <Textarea
                value={message}
                minH={16}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key == 'Enter' && !(e.shiftKey || e.ctrlKey)) {
                        handleSend();
                        e.preventDefault();
                    }
                    if (e.key == 'Escape') {
                        onClose?.();
                    }
                    handleTyping();
                }}
            />
            <Button flex='none' onClick={handleSend}>
                <FaPaperPlane />
            </Button>
        </Flex>
    )
}

export default SendMessage;
