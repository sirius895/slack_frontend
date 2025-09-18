import { Avatar, Button, HStack, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, VStack } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { METHODS, TYPES } from "../../constants/chat";
import { AuthContext } from "../../providers/AuthProvider";
import { SocketContext } from "../../providers/SocketProvider";

const ChannelModal = (props) => {
  const { isChannel, selectedID, setSelectedID, modalStatus, setModalStatus } = props;
  const { users, socket, channels } = useContext(SocketContext);
  const { user } = useContext(AuthContext);
  const initState = { name: "", creator: "", members: [], isChannel };
  const [channel, setChannel] = useState(initState);
  const [tmp, setTmp] = useState([]);
  const [keyword, setKeyword] = useState("");

  const changeChannel = (e) => {
    setChannel({ ...channel, [e.target.name]: e.target.value });
  };

  const changeMembers = (_id) => {
    setChannel({
      ...channel,
      members: !channel.members.includes(_id) ? [...channel.members, _id] : channel.members.filter((v) => v !== _id),
    });
  };

  useEffect(() => {
    if (selectedID >= 0) {
      const curChannel = channels[selectedID];
      setChannel(curChannel);
    } else setChannel(initState);
  }, [selectedID, setChannel]);

  const handleCreate = () => {
    socket.emit(`${TYPES.CHANNEL}_${METHODS.CREATE}`, { ...channel, creator: user?._id, members: [...channel.members, user?._id] });
    handleCancel();
  };

  const handleUpdate = () => {
    socket.emit(`${TYPES.CHANNEL}_${METHODS.UPDATE}`, channel);
    handleCancel();
  };

  const handleCancel = () => {
    setModalStatus("init");
    setChannel(initState);
    setSelectedID(-1);
  };

  // useEffect(() => {
  //   if (user?._id) {
  //     setChannel({ ...channel, creator: user?._id, members: [user?._id] })
  //   }
  // }, [user?._id])

  useEffect(() => {
    if (users?.length) setTmp(users);
  }, [users]);

  useEffect(() => {
    setTmp(users?.filter((u) => u?.username?.toLowerCase().includes(keyword.toLowerCase()) || u.email.toLowerCase().includes(keyword.toLowerCase())));
  }, [keyword]);

  return (
    <Modal h={"full"} isOpen={modalStatus === "add" || modalStatus === "edit"} isCentered>
      <ModalOverlay />
      <ModalContent w={"full"} maxH={"560px"} h={"90%"} alignItems={"center"} justifyContent={"center"}>
        <ModalHeader display={"flex"} w={"full"} alignItems={"center"} justifyContent={"center"}>
          {(modalStatus === "add" && `Create`) || (modalStatus === "edit" && `Update`)} a channel
        </ModalHeader>
        <ModalBody display={"flex"} flexGrow={1} overflowY={"auto"} flexDir={"column"} paddingInline={4} w={"full"} gap={4}>
          <HStack w={"full"} h={"40px"}>
            <Input w={"full"} h={"40px"} name="name" placeholder="Chanel Name" value={channel.name} onChange={changeChannel} />
          </HStack>
          <HStack w={"full"} h={"40px"}>
            <Input w={"full"} h={"40px"} placeholder="Search Users" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
          </HStack>
          <VStack w={"full"} border={"1px solid #e2e8f0"} rounded={"8px"} overflowY={"auto"}>
            {tmp.map((u, i) => {
              return (
                u._id !== user?._id && (
                  <HStack
                    key={i}
                    w={"full"}
                    cursor={"pointer"}
                    onClick={() => changeMembers(u._id)}
                    paddingInline={4}
                    paddingBlock={2}
                    justify={"space-between"}
                  >
                    <HStack gap={4}>
                      <Avatar w={"32px"} h={"32px"} />
                      <Text>{u.username}</Text>
                    </HStack>
                    {channel.members.includes(u._id) && <FaCheck />}
                  </HStack>
                )
              );
            })}
          </VStack>
        </ModalBody>
        <ModalFooter w={"full"} justifyContent={"space-between"}>
          <Button onClick={(modalStatus === "add" && handleCreate) || (modalStatus === "edit" && handleUpdate)}>
            {(modalStatus === "add" && `Create`) || (modalStatus === "edit" && `Update`)}
          </Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ChannelModal;
