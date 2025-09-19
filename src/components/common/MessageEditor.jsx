import { Box, Fade, FormLabel, HStack, Input, Spinner, Text, Textarea, transform, VStack } from "@chakra-ui/react";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { FaBold, FaItalic, FaPaperPlane, FaPlus, FaRegSmile } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { upload } from "../../api/file";
import { METHODS, TYPES } from "../../constants/chat";
import { AuthContext } from "../../providers/AuthProvider";
import { SocketContext } from "../../providers/SocketProvider";
import Emoticon from "./Emoticon";
import Emoticons from "./Emoticons";
import toast from "../../utils/toast";

const MessageEditor = ({ isForThread }) => {
  const { user } = useContext(AuthContext);
  const { socket, users, channels, curChannel } = useContext(SocketContext);
  const { channel: channelID, message: messageID } = useParams();
  const [emoShow, setEmoShow] = useState(false);
  const [typingList, setTypingList] = useState([]);
  const timerRef = useRef({});
  const [mentionShow, setMentionShow] = useState(false);
  const [bold, setBold] = useState(false);
  const [italic, steItalic] = useState(false);
  const [fileListShow, setFileListShow] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const members = useMemo(() => {
    const memberIDs = channels.find((c) => c._id === channelID)?.members;
    return users.filter((u) => memberIDs?.includes(u._id));
  }, [channelID, channels, users]);
  const [files, setFiles] = useState({});

  const initState = {
    sender: "",
    channelID,
    mentions: [],
    content: "",
    files: [],
    emoticons: [],
    pinnedBy: [],
    isDraft: false,
    parentID: isForThread ? messageID : null,
    childCount: 0,
  };

  const [message, setMessage] = useState(initState);
  const changeContent = (e) => {
    const value = e.target.value;
    if (value[value.length - 1] === "@") {
      setMentionShow(true);
      return;
    }
    setMessage({ ...message, content: e.target.value });
  };

  const createMessage = async () => {
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
      const res = await upload(formData, setUploadProgress);
      socket.emit(`${TYPES.MESSAGE}_${METHODS.CREATE}`, { ...message, files: res.data.payload.map((f) => f._id) });
      setMessage({ ...initState, sender: user?._id, channelID });
    } catch (error) {
      toast("Upload failed. Try again.");
    }
    setFiles({});
    setUploadProgress(0);
  };

  const handleKeyDown = (e) => {
    if (messageID.length > 1 && isForThread) socket.emit(`${TYPES.TYPING}`, { channelID, messageID });
    if (e.code === "Escape") setMentionShow(false);
    if (e.code === "Enter") {
      e.preventDefault();
      if (channelID.length < 10) {
        toast.ERROR("Please choose a channel!");
        return;
      }
      createMessage();
    }
  };

  const handleEmos = (code) => {
    setMessage((msg) => ({
      ...msg,
      emoticons: msg.emoticons.find((emo) => emo.code === code)
        ? msg.emoticons.filter((emo) => emo.code !== code)
        : [...msg.emoticons, { sender: user?._id, code }],
    }));
  };

  const handleMentions = (user) => {
    setMessage((msg) => ({
      ...msg,
      mentions: msg.mentions.find((m) => m === user?._id) ? msg.mentions.filter((m) => m !== user?._id) : [...msg.mentions, user?._id],
    }));
  };

  const listenTyping = (status, data) => {
    if (status && data.messageID === messageID && isForThread) {
      const removeUser = () => setTypingList((prev) => prev.filter((user) => user !== data.user));
      setTypingList((prev) => {
        if (prev.some((user) => user === data.user)) {
          clearTimeout(timerRef.current[data.user]);
          timerRef.current[data.user] = setTimeout(removeUser, 2000);
          return prev;
        }
        timerRef.current[data.user] = setTimeout(removeUser, 2000);
        return [...prev, data.user];
      });
    }
  };

  const removeEmos = (no) =>
    setMessage((msg) => ({
      ...msg,
      emoticons: msg.emoticons.filter((m, i) => i !== no),
    }));

  const handleFiles = (e) => {
    setFiles(e.target.files);
  };

  useEffect(() => {
    if (user?._id) setMessage((m) => ({ ...m, sender: user?._id }));
  }, [user?._id]);

  useEffect(() => {
    if (channelID.length > 0) setMessage((m) => ({ ...m, channelID }));
    socket.on(TYPES.TYPING, listenTyping);
    return () => socket.removeListener(TYPES.TYPING, listenTyping);
  }, [channelID]);

  const removeFile = (index) => {
    const temp = [...files];
    temp.splice(index, 1);
    setFiles(temp);
  };
  const removeMention = (_id) => {
    setMessage({ ...message, mentions: message.mentions.filter((m) => m._id !== _id) });
  };

  return (
    <VStack w={"full"} h={"full"} rounded={8} shadow={"0 0 3px black"}>
      <HStack w={"full"} h={"40px"} px={4} gap={2} bg={"#d7d5d596"} color={"gray"} pos={"relative"}>
        <FaBold cursor={"pointer"} onClick={() => setBold(!bold)} />
        <FaItalic cursor={"pointer"} onClick={() => steItalic(!italic)} />
        {typingList.length > 0 && (
          <Text
            w={"full"}
            fontWeight={"bold"}
            fontSize="16px"
            textOverflow={"ellipsis"}
            whiteSpace={"nowrap"}
            overflow={"hidden"}
            width={"160px"}
            pos={"absolute"}
            left={"4px"}
            top={"4px"}
            bg={"white"}
            rounded={"8px"}
            px={2}
          >
            {typingList.map((userId) => users.find((user) => user?._id === userId)?.username).join(", ")} is typing...
          </Text>
        )}
        <HStack gap={4}>
          {message.mentions.map((m, i) => (
            <Text key={i} fontFamily={"cursive"} fontWeight={"bold"} color={"var(--markUpColor)"} cursor={"pointer"} onClick={() => removeMention(m._id)}>
              @{users?.find((u) => u._id === m)?.username}
            </Text>
          ))}
        </HStack>
      </HStack>
      {!isForThread && mentionShow && (
        <HStack w={"full"} pos={"relative"} onMouseLeave={() => setMentionShow(false)}>
          <VStack w={"80px"} pos={"absolute"} zIndex={5} rounded={"8px"} py={2} bg={"white"} shadow={"0 0 3px"} left={4} top={0}>
            {members.length ? (
              members?.map(
                (m, i) =>
                  m._id !== user._id && (
                    <Text
                      key={i}
                      w={"full"}
                      p={1}
                      maxH={"300px"}
                      overflowY={"auto"}
                      cursor={"pointer"}
                      _hover={{ bg: "#e1dfdf8a" }}
                      onClick={() => handleMentions(m)}
                      overflow={"hidden"}
                      textOverflow={"ellipsis"}
                      whiteSpace={"nowrap"}
                      fontWeight={"bold"}
                      color={"var(--markUpColor)"}
                    >
                      {m.username}
                    </Text>
                  )
              )
            ) : (
              <Text>No user</Text>
            )}
          </VStack>
        </HStack>
      )}
      <VStack w={"full"} flex={"1 1 0"}>
        <Textarea
          h={"full"}
          resize={"none"}
          border={"none"}
          fontWeight={bold && "bold"}
          fontStyle={italic && "italic"}
          _focus={{ outline: "none" }}
          onChange={changeContent}
          onKeyDown={handleKeyDown}
          value={message.content}
          placeholder={`To ${curChannel?._id && !curChannel?.isChannel ? users?.find((u) => u?._id === curChannel?.members[1])?.username : curChannel?.name}`}
        />
      </VStack>
      <HStack w={"full"} px={4} h={"32px"}>
        {message.emoticons.map((emo, i) => (
          <Emoticon key={i} id={emo.code} onClick={() => removeEmos(i)} />
        ))}
      </HStack>
      <HStack w={"full"} h={"52px"} justify={"space-between"} px={4} gap={2} color={"gray"}>
        <HStack gap={2} cursor={"pointer"}>
          <FormLabel>
            <Input type={"file"} display={"none"} onChange={handleFiles} multiple />
            <Box _hover={{ transform: "scale(1.2)" }}>
              <FaPlus cursor={"pointer"} />
            </Box>
          </FormLabel>
          <HStack pos={"relative"} onMouseLeave={() => setEmoShow(false)}>
            <FaRegSmile cursor={"pointer"} onClick={() => setEmoShow(!emoShow)} />
            {emoShow && <Emoticons w={"300px"} pos={"absolute"} bottom={"100%"} left={0} handleEmos={handleEmos} />}
          </HStack>
          <HStack pos={"relative"}>
            {files.length && (
              <Box onClick={() => setFileListShow(!fileListShow)}>
                <Text>
                  {files.length} file{files.length ? "s" : ""}
                </Text>
              </Box>
            )}
            {uploadProgress && uploadProgress < 100 && <Spinner label="upoloading" color="var(--mainColor)" />}
            <Text>{uploadProgress ? `${uploadProgress}%` : null}</Text>
            <VStack
              h={"120px"}
              pos={"absolute"}
              bg={"white"}
              overflowX={"hidden"}
              shadow={"0 0 4px"}
              rounded={"8px"}
              bottom={0}
              left={0}
              onMouseLeave={() => setFileListShow(false)}
            >
              {fileListShow &&
                Object.keys(files).map((key, i) => (
                  <HStack key={i} h={"40px"} w={"100px"}>
                    <Text w={"100px"} p={2} onClick={() => removeFile(i)} textOverflow={"ellipsis"} overflow={"hidden"} whiteSpace={"nowrap"}>
                      {files[key].name}
                    </Text>
                  </HStack>
                ))}
            </VStack>
          </HStack>
        </HStack>
        <HStack>
          <FaPaperPlane onClick={createMessage} />
        </HStack>
      </HStack>
    </VStack>
  );
};

export default MessageEditor;
