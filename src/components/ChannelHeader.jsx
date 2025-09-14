import { Avatar, Box, Flex, HStack, Text } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { FaEdit, FaRegTrashAlt } from "react-icons/fa";
import { METHOD, REQUEST } from "../constants/chat";
import { SocketContext } from "../providers/SocketProvider";
import ChannelEditModal from "./ChannelEditModal";

const ChannelHeader = ({ channel, ...props }) => {
  const { socket } = useContext(SocketContext);
  const [showChannelEditModal, setShowChannelEditModal] = useState(false);

  const handleDeleteChannel = () => {
    socket.emit(`${REQUEST.CHANNEL}_${METHOD.DELETE}`, { id: channel._id });
  }

  return (
    <>
      <Flex p={4} justify='space-between' {...props}>
        <HStack>
          <Text>
            # {channel.name}
          </Text>
          <Box cursor='pointer' onClick={() => setShowChannelEditModal(true)}>
            <FaEdit />
          </Box>
          <Box cursor='pointer' onClick={handleDeleteChannel}>
            <FaRegTrashAlt color="red" />
          </Box>
        </HStack>
        <Flex gap={2}>
          <Flex>
            {channel.members.filter((_, index) => index < 4).map(member => (
              <Box ml={-2} key={member._id}>
                <Avatar size="xs" />
              </Box>
            ))}
          </Flex>
          {channel.members.length > 4 && (
            <Text>
              +{channel.members.length - 4}
            </Text>
          )}
        </Flex>
      </Flex>
      <ChannelEditModal
        key={channel._id}
        channel={channel}
        isOpen={showChannelEditModal}
        onClose={() => setShowChannelEditModal(false)}
      />
    </>
  )
}

export default ChannelHeader;
