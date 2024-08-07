import { useEffect, useRef, useState } from "react";
import { GrMicrophone } from "react-icons/gr";
import { AiOutlinePaperClip } from "react-icons/ai";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import MessageTimestamp from './time';
import dynamic from "next/dynamic";

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

const ChatArea = ({ contact }) => {
  const [inputValue, setInputValue] = useState("");
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [readMessages, setReadMessages] = useState(new Set());

  const messagesEndRef = useRef(null);  // Ref برای اسکرول به انتهای چت

  useEffect(() => {
    const createOrJoinRoom = async () => {
      if (contact && !ws) {
        try {
          const response = await fetch('/api/create-or-join-room', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('access')}`,
            },
            body: JSON.stringify({ username: contact.username })
          });

          if (!response.ok) {
            throw new Error('Failed to create or join room');
          }

          const data = await response.json();
          const roomName = data.name;
          setRoomName(roomName);

          const webSocket = new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/`);

          webSocket.onmessage = (e) => {
            const data = JSON.parse(e.data);

            if (data.type === 'initial_messages') {
              setMessages(data.messages);
            } else if (data.type === 'chat_message') {
              setMessages(prevMessages => [...prevMessages, data.message]);
            } else if (data.type === 'message_read_update') {
              setReadMessages(prevReadMessages => new Set(prevReadMessages).add(data.message_id));
            }
          };

          webSocket.onopen = () => {
            console.log('WebSocket connected');
            setWs(webSocket);
          };

          webSocket.onclose = () => {
            console.log('WebSocket disconnected');
            setWs(null);
          };

        } catch (error) {
          console.error('Error creating or joining room:', error);
        }
      }
    };

    createOrJoinRoom();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [contact, ws]);

  useEffect(() => {
    if (ws) {
      messages.forEach(message => {
        if (!message.read && message.user !== localStorage.getItem('username')) {
          ws.send(JSON.stringify({
            type: 'message_read',
            message_id: message.id
          }));
        }
      });
    }
  }, [messages, ws]);

  useEffect(() => {
    // اسکرول به انتهای چت
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = () => {
    if (inputValue && ws) {
      ws.send(JSON.stringify({
        type: 'chat_message',
        message: inputValue,
        username: localStorage.getItem('username')
      }));
      setInputValue("");
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setInputValue(prevInput => prevInput + emojiObject.emoji);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  if (!contact) {
    return (
      <div className="flex-grow flex items-center justify-center bg-gradient-to-b from-purple-400 to-purple-300 bg-custom-gradientnt">
        <h2 className="text-2xl font-bold text-textColor">
          یکی از مخاطبین را برای شروع چت انتخاب کنید
        </h2>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-screen flex-1 text-white bg-gradient-to-b from-purple-100 via-purple-200 to-purple-300">
      <div className="w-full p-5 border-b flex items-center bg-purple-100">
        <div className="avatar placeholder mr-3">
          <div className="btn rounded-badge glass bg-purple-500 text-secondaryTextColor">
            <span className="">{contact.avatar}</span>
          </div>
        </div>
        <h2 className="text-xl text-gray/90 font-bold">{contact.username}</h2>
      </div>

      <div className="chat-container overflow-y-scroll flex-1">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat flex flex-col p-5 ${
              msg.user === localStorage.getItem('username') ? 'chat-end' : 'chat-start'
            }`}
          >
            <div
              className={`chat-bubble break-all max-w-[90%] ${
                msg.user === localStorage.getItem('username') ? 'chat-bubble-accent bg-secondaryTextColor' : 'bg-secondaryColor text-secondaryTextColor'
              }`}
            >
              {msg.content}
            </div>
            <p className="text-gray chat-footer pt-1">
              <MessageTimestamp timestamp={msg.timestamp} />
              {msg.read && msg.user === localStorage.getItem('username') && (
                <span className="text-primaryPurple pl-2">✔✔</span>
              ) || !msg.read && msg.user === localStorage.getItem('username') && (
                <span className="text-primaryPurple pl-2">✔</span>
              )}
              {readMessages.has(msg.id) && msg.user === localStorage.getItem('username') && (
                <span className="text-primaryPurple">✔</span>
              )}
            </p>
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* مرجع برای اسکرول به انتهای چت */}
      </div>

      <div dir="rtl" className="w-full p-4 border-t border-purple-900 flex items-center">
        <div
          className={`shadow-sm rounded-full p-3 ${
            inputValue ? 'bg-blue shadow-blue' : 'bg-primaryPurple shadow-secondaryColor'
          }`}
          onClick={handleSendMessage}
        >
          {inputValue ? (
            <IoSend className="text-2xl cursor-pointer text-svgColor" />
          ) : (
            <GrMicrophone className="text-2xl text-svgColor" />
          )}
        </div>

        <div className="absolute right-20 dropdown dropdown-top dropdown-start">
          <div tabIndex={0} role="button" className="mr-3">
            <AiOutlinePaperClip className="text-3xl text-svgColor hover:text-hoverColor" />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-fit p-2 shadow"
          >
            <li>
              <div className="flex items-center">
                <span className="ml-2 text-nowrap">عکس یا فیلم</span>
              </div>
            </li>
            <li>
              <a>Item 2</a>
            </li>
            <li>
              <a>Item 3</a>
            </li>
          </ul>
        </div>
        <input
          className="w-full p-3 pr-16 mr-3 text-secondaryTextColor bg-purple-900/90 text-white rounded-full focus:outline-none"
          placeholder="پیام خود را وارد کنید..."
          value={inputValue}
          onChange={handleChange}
        />
        <MdOutlineEmojiEmotions
          className="absolute left-6 text-3xl hover:text-hoverColor"
          onClick={toggleEmojiPicker}
        />
        {showEmojiPicker && (
          <div className="absolute bottom-16 left-6">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatArea;
