import { HStack, Text, VStack } from "@chakra-ui/react";
import { useCallback, useContext, useEffect, useState } from "react";
import { FaCaretDown, FaCaretRight, FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { METHODS, TYPES } from "../../constants/chat";
import { AuthContext } from "../../providers/AuthProvider";
import { SocketContext } from "../../providers/SocketProvider";
import toast from "../../utils/toast";
import ChannelDeleteModal from "../modals/ChannelDeleteModal";
import CreateChannelModal from "../modals/ChannelModal";

const ChannelList = () => {
  const [showCh, setShowCh] = useState(true);
  const { socket, channels, setChannels, setCurChannel } = useContext(SocketContext);
  const [selectedID, setSelectedID] = useState(-1);
  const [modalStatus, setModalStatus] = useState("init");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { channel: channelID } = useParams();

  const listenCreate = useCallback(
    (status, data) => {
      if (status && data) setChannels([...channels, data]);
      else toast.ERROR(data.message);
    },
    [channels, setChannels]
  );

  const listenUpdate = useCallback(
    (status, data) => {
      if (status && data) {
        // setChannels(channels => channels.map((c) => c._id === data._id ? data : c))
        socket.emit(`${TYPES.CHANNEL}_${METHODS.READ_BY_USER_ID}`, user?._id);
      } else toast.ERROR(data.message);
    },
    [socket, user?._id]
  );

  const listenDelete = useCallback(
    (status, data) => {
      if (status && data) setChannels((channels) => channels.filter((c) => c._id !== data._id));
      else toast.ERROR(data.message);
    },
    [setChannels]
  );

  useEffect(() => {
    socket.on(`${TYPES.CHANNEL}_${METHODS.CREATE}`, listenCreate);
    return () => socket.removeListener(`${TYPES.CHANNEL}_${METHODS.CREATE}`, listenCreate);
  }, [listenCreate, socket]);

  useEffect(() => {
    socket.on(`${TYPES.CHANNEL}_${METHODS.UPDATE}`, listenUpdate);
    return () => socket.removeListener(`${TYPES.CHANNEL}_${METHODS.UPDATE}`, listenUpdate);
  });

  useEffect(() => {
    socket.on(`${TYPES.CHANNEL}_${METHODS.DELETE}`, listenDelete);
    return () => socket.removeListener(`${TYPES.CHANNEL}_${METHODS.DELETE}`, listenDelete);
  });

  return (
    <VStack w={"full"} paddingInline={2}>
      <CreateChannelModal isChannel={true} selectedID={selectedID} setSelectedID={setSelectedID} modalStatus={modalStatus} setModalStatus={setModalStatus} />
      <ChannelDeleteModal selectedID={selectedID} modalStatus={modalStatus} setSelectedID={setSelectedID} setModalStatus={setModalStatus} />
      <HStack w={"full"} gap={4} onClick={() => setShowCh(!showCh)}>
        {showCh ? <FaCaretDown /> : <FaCaretRight />}
        <Text fontSize={"20px"}>Channels</Text>
      </HStack>
      <VStack w={"full"} pl={2} py={2}>
        {showCh &&
          channels.map((channel, i) => {
            return (
              channel.isChannel &&
              channel.members.includes(user?._id) && (
                <HStack
                  key={i}
                  w={"full"}
                  gap={4}
                  rounded={8}
                  px={2}
                  py={1}
                  bg={channel._id === channelID && "var(--mainColor)"}
                  _hover={{ backgroundColor: "var(--fontColor)" }}
                  cursor={"pointer"}
                  justify={"space-between"}
                  onClick={() => {
                    setCurChannel(channel);
                    navigate(`/chatting/home/${channel._id}/@`);
                  }}
                >
                  <HStack gap={2}>
                    <Text>#</Text>
                    <Text>{channel.name}</Text>
                  </HStack>
                  <HStack gap={2}>
                    {channel.creator === user?._id && (
                      <FaEdit
                        onClick={() => {
                          setSelectedID(i);
                          setModalStatus("edit");
                        }}
                      />
                    )}
                    {channel.creator === user?._id && (
                      <FaTrash
                        onClick={() => {
                          setSelectedID(i);
                          setModalStatus("delete");
                        }}
                      />
                    )}
                  </HStack>
                </HStack>
              )
            );
          })}
      </VStack>
      <HStack
        w={"full"}
        gap={4}
        justify={"flex-start"}
        cursor={"pointer"}
        onClick={() => {
          setModalStatus("add");
        }}
      >
        <FaPlus />
        <Text>Add Channel</Text>
      </HStack>
    </VStack>
  );
};

export default ChannelList;
