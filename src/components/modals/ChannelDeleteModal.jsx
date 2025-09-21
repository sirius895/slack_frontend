import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react";
import { useContext } from "react";
import { METHODS, TYPES } from "../../constants/chat";
import { SocketContext } from "../../providers/SocketProvider";

const ChannelDeleteModal = (props) => {
  const { modalStatus, setModalStatus, selectedID, setSelectedID } = props;
  const { socket, channels } = useContext(SocketContext);

  const handleCancel = () => {
    setModalStatus("init");
    setSelectedID(-1);
  };

  const handleDelete = () => {
    socket.emit(`${TYPES.CHANNEL}_${METHODS.DELETE}`, channels[selectedID]._id);
    handleCancel();
  };

  return (
    <Modal isOpen={modalStatus === "delete"} isCentered>
      <ModalOverlay />
      <ModalContent w={"full"} h="20%" bg={"var(--secondaryColor)"} color={"white"} minH={"200px"} alignItems={"center"} justifyContent={"center"}>
        <ModalHeader display={"flex"} w={"full"} minH={"40px"} p={0} alignItems={"center"} justifyContent={"center"}></ModalHeader>
        <ModalBody display={"flex"} flexDir={"column"} paddingInline={4} w={"full"} gap={4} justifyContent={"center"} alignItems={"center"}>
          <Text fontFamily={"cursive"} fontSize={24} textAlign={"center"}>
            Do you really wanna delete this channel?
          </Text>
        </ModalBody>
        <ModalFooter w={"full"} justifyContent={"space-between"}>
          <Button bg={"var(--mainColor)"} onClick={handleDelete}>
            Delete
          </Button>
          <Button bg={"var(--mainColor)"} onClick={handleCancel}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ChannelDeleteModal;
