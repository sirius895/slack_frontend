import { Avatar, Button, CloseButton, Flex, HStack, Popover, Spinner, Text, VStack } from "@chakra-ui/react";
import { useContext, useEffect, useMemo, useState } from "react";
import { FaBell, FaHome, FaUser } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import ChannelHeader from "../components/ChannelHeader";
import CreateChannelModal from "../components/CreateChannelModal";
import Messages from "../components/Messages";
import { METHOD, REQUEST, STATUS } from "../constants/chat";
import { SocketContext } from "../providers/SocketProvider";

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { socket } = useContext(SocketContext);
  const [channelId, setChannelId] = useState();
  const [messageId, setMessageId] = useState();
  const [channels, setChannels] = useState([]);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);

  const channel = useMemo(
    () => {
      const channel = channels.find(channel => channel._id == channelId);
      if (!channel && channels.length > 0) {
        navigate(`/?channel=${channels[0]._id}`)
      }
      return channel;
    },
    [channels, channelId]
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setChannelId(params.get('channel'));
    setMessageId(params.get('message'));
  }, [location]);

  const onCreateChannel = (status, data) => {
    if (status == STATUS.ON) {
      setChannels(prev => [...prev, data]);
    }
  }

  const onReadChannels = (status, data) => {
    if (status == STATUS.ON) {
      setChannels(data);
    }
  }

  const onUpdateChannel = (status, data) => {
    if (status == STATUS.ON) {
      setChannels((prev) => prev.map(channel => channel._id == data._id ? data : channel));
    }
  }

  const onDeleteChannel = (status, data) => {
    if (status == STATUS.ON) {
      setChannels((prev) => prev.filter(channel => channel._id != data.id));
    }
  }

  useEffect(() => {
    socket.emit(`${REQUEST.CHANNEL}_${METHOD.READ}`);
    socket.on(`${REQUEST.CHANNEL}_${METHOD.CREATE}`, onCreateChannel);
    socket.on(`${REQUEST.CHANNEL}_${METHOD.READ}`, onReadChannels);
    socket.on(`${REQUEST.CHANNEL}_${METHOD.UPDATE}`, onUpdateChannel);
    socket.on(`${REQUEST.CHANNEL}_${METHOD.DELETE}`, onDeleteChannel);
    return () => {
      socket.removeListener(`${REQUEST.CHANNEL}_${METHOD.CREATE}`, onCreateChannel);
      socket.removeListener(`${REQUEST.CHANNEL}_${METHOD.READ}`, onReadChannels);
      socket.removeListener(`${REQUEST.CHANNEL}_${METHOD.UPDATE}`, onUpdateChannel);
      socket.removeListener(`${REQUEST.CHANNEL}_${METHOD.DELETE}`, onDeleteChannel);
    }
  }, []);

  return (
    <>
      <Flex h='100vh' direction='column'>
        <Flex flex='1 1 0' templatecolumns='repeat(5, minmax(0, 1fr))'>
          <VStack
            w={{ base: '240px', lg: '320px' }}
            p={4}
            align='stretch'
            gap={1}
            bg='rgb(80, 30, 80)'
            overflowY='auto'
          >
            {channels.map(channel => (
              <Flex
                key={channel._id}
                p={1}
                justify='space-between'
                align='center'
                rounded={4}
                cursor='pointer'
                _hover={{ bg: '#fff2' }}
                {...(channelId == channel._id && { bg: '#0002' })}
                onClick={() => navigate(`/?channel=${channel._id}`)}
              >
                <Text fontSize="sm" color="white">
                  {channel.name}
                </Text>
              </Flex>
            ))}
            <Button size='xs' onClick={() => setShowCreateChannelModal(true)}>
              Create channel
            </Button>
          </VStack>
          {/* {channel ? (
            <VStack flexGrow={1} align="stretch">
              <ChannelHeader
                borderBottom='1px solid #ccc'
                channel={channel}
              />
              <HStack flex='1 1 0'>
                <Messages
                  flexGrow={1}
                  h='full'
                  channelId={channelId}
                  messageId={null}
                />
                {messageId && (
                  <VStack w={{ base: '50%', lg: '35%' }} h='full' align='stretch' borderLeft='1px solid #ccc'>
                    <HStack px={4} justify='space-between'>
                      <Text>
                        Thread
                      </Text>
                      <CloseButton
                        onClick={() => navigate(`/?channel=${channelId}`)}
                      />
                    </HStack>
                    <Messages
                      h='full'
                      channelId={channelId}
                      messageId={messageId}
                    />
                  </VStack>
                )}
              </HStack>
            </VStack>
          ) : (
            <Flex flexGrow={1} h='full' direction='column' justify='center' align='center' gap={2}>
              <VStack>
                <Spinner />
                <Text fontSize="sm">
                  Loading...
                </Text>
              </VStack>
            </Flex>
          )} */}
        </Flex>
      </Flex>
      <CreateChannelModal
        isOpen={showCreateChannelModal}
        onClose={() => setShowCreateChannelModal(false)}
        setChannels={setChannels}
      />
    </>
  );
};

export default HomePage;
