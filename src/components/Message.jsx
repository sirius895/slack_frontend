import { Avatar, Badge, Box, Flex, Grid, HStack, Popover, PopoverContent, PopoverTrigger, Text, VStack } from "@chakra-ui/react";
import { useContext, useMemo, useState } from "react";
import { FaEdit, FaRegCommentDots, FaRegSmile, FaRegTrashAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import useUser from "../api/useUsers";
import { METHOD, REQUEST } from "../constants/chat";
import { SocketContext } from "../providers/SocketProvider";
import { formatDate, formatTime } from "../utils";
import Emoticon from "./Emoticon";
import Emoticons from "./Emoticons";
import SendMessage from "./SendMessage";

const Message = ({ showDate, channelId, messageId, message }) => {
  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);
  const { users } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const sender = useMemo(() => users.find(user => user._id == message.sender), [users, message]);

  const emoticons = useMemo(() => {
    return message.emoticons.reduce((prev, emoticon) => {
      const group = prev.some(prev => prev.code == emoticon.code);
      if (!group) {
        return [...prev, { code: emoticon.code, users: [emoticon.creator] }];
      }
      return prev.map(group => {
        if (group.code == emoticon.code) {
          return {
            code: emoticon.code,
            users: [...group.users, emoticon.creator],
          }
        }
        return group;
      });
    }, []);
  }, [message]);

  const handleDelete = () => {
    socket.emit(`${REQUEST.MESSAGE}_${METHOD.DELETE}`, { id: message._id });
  }

  const handleEmoticon = (id) => {
    socket.emit(REQUEST.EMOTICON, {
      messageId: message._id,
      emoticonId: id,
    });
  }

  return (
    <>
      {showDate && (
        <Flex justify='center' borderBottom='1px solid #ddd'>
          <Badge mb={-2} variant="outline" bg='white' >
            {formatDate(message.createdAt)}
          </Badge>
        </Flex>
      )}
      <Popover placement="top">
        <PopoverTrigger>
          <Flex key={message._id} p={2} gap={4}>
            <Avatar size="sm" />
            <VStack flexGrow={1} align='stretch'>
              <Flex direction='column'>
                <Flex gap={4}>
                  <Text fontWeight='bold' fontSize='sm'>
                    {sender?.username}
                  </Text>
                  <Text fontSize="sm">
                    {formatTime(message.createdAt)}
                  </Text>
                </Flex>
                {isEditing ? (
                  <SendMessage
                    isEditing
                    value={message.message}
                    messageId={message._id}
                    onClose={() => setIsEditing(false)}
                  />
                ) : (
                  <Text fontSize="sm">
                    {message.message}
                  </Text>
                )}
                {message.childCount > 0 && (
                  <Link
                    to={`/?channel=${channelId}&message=${message._id}`}
                  >
                    <Text
                      fontSize="sm"
                      color='blue.400'
                      _hover={{ textDecoration: 'underline' }}
                    >
                      {message.childCount} replies
                    </Text>
                  </Link>
                )}
                <HStack>
                  {emoticons.map((emoticon, index) => (
                    <Box key={index} cursor='pointer'
                      onClick={() => handleEmoticon(emoticon.code)}
                    >
                      <Flex align='center' gap={0.5}>
                        <Emoticon id={emoticon.code} />
                        <Text fontSize='xs' color='gray.600'>
                          {emoticon.users.length}
                        </Text>
                      </Flex>
                    </Box>
                  ))}
                </HStack>
              </Flex>
            </VStack>
          </Flex>
        </PopoverTrigger >
        <PopoverContent w='unset'>
          <HStack p={2} gap={2}>
            <Popover>
              <PopoverTrigger>
                <Box cursor='pointer'>
                  <FaRegSmile />
                </Box>
              </PopoverTrigger>
              <PopoverContent w='unset' p={2}>
                <Grid gap={1} templatecolumns='repeat(8, minmax(0, 1fr))'>
                  <Emoticons onSelect={handleEmoticon} />
                </Grid>
              </PopoverContent>
            </Popover>
            {messageId == null && (
              <Box cursor='pointer' onClick={() => navigate(`/?channel=${channelId}&message=${message._id}`)}>
                <FaRegCommentDots />
              </Box>
            )}
            <Box cursor='pointer' onClick={() => setIsEditing(true)} >
              <FaEdit />
            </Box>
            <Box cursor='pointer' onClick={handleDelete} >
              <FaRegTrashAlt color="red" />
            </Box>
          </HStack>
        </PopoverContent>
      </Popover >
    </>
  )
}

export default Message;
