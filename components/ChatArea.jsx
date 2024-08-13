import { useEffect, useRef, useState, useCallback } from "react";
import { GrMicrophone } from "react-icons/gr";
import { AiOutlinePaperClip } from "react-icons/ai";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import MessageTimestamp from './time';
import dynamic from "next/dynamic";
import axios from "axios";
import { IoIosArrowBack } from "react-icons/io";

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

const MESSAGES_BATCH_SIZE = 20; 

const ChatArea = ({ contact, onBack, consultant }) => {

  const [inputValue, setInputValue] = useState("");
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [readMessages, setReadMessages] = useState(new Set());
  const [hasMoreMessages, setHasMoreMessages] = useState(true); // برای بررسی وجود پیام‌های بیشتر
  const [loadingMessages, setLoadingMessages] = useState(false); // برای جلوگیری از بارگذاری همزمان

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const fetchMoreMessages = useCallback(() => {
    if (loadingMessages || !hasMoreMessages) return;

    setLoadingMessages(true);

    if (ws) {
      ws.send(JSON.stringify({
        type: 'load_more_messages',
        offset: messages.length,
      }));
    }
  }, [loadingMessages, hasMoreMessages, ws, messages]);

  useEffect(() => {
    const handleScroll = () => {
      if (chatContainerRef.current.scrollTop === 0 && hasMoreMessages) {
        fetchMoreMessages();
      }
    };

    if (chatContainerRef.current) {
      chatContainerRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (chatContainerRef.current) {
        chatContainerRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [fetchMoreMessages, hasMoreMessages]);

  useEffect(() => {
    const createOrJoinRoom = async () => {
      if (contact && !consultant && !ws) {
        try {
          const response = await fetch('/api/create-or-join-room', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('access')}`,
            },
            body: JSON.stringify({ username: contact.username, type : "without" })
          });

          if (!response.ok) {
            throw new Error('Failed to create or join room');
          }

          const data = await response.json();
          const roomName = data.name;
          setRoomName(roomName);

          const webSocket = new WebSocket(`wss://evtopback.liara.run/ws/chat/${roomName}/`);

          webSocket.onmessage = (e) => {
            const data = JSON.parse(e.data);

            if (data.type === 'initial_messages') {
              setMessages(data.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))); // معکوس کردن پیام‌ها تا جدیدترین پیام‌ها در پایین باشند
              if (data.messages.length < MESSAGES_BATCH_SIZE) {
                setHasMoreMessages(false);
              }
              // اسکرول به پایین پس از بارگذاری پیام‌ها
              setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            } else if (data.type === 'more_messages') {
              if (data.messages.length < MESSAGES_BATCH_SIZE) {
                setHasMoreMessages(false);
              }
              const sortedMessages = data.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
              const scrollTopBeforeFetch = chatContainerRef.current.scrollHeight;
              setMessages(prevMessages => [...sortedMessages, ...prevMessages]);
              setLoadingMessages(false);
              // حفظ مکان اسکرول
              setTimeout(() => {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight - scrollTopBeforeFetch;
              }, 100);
            } else if (data.type === 'chat_message') {
              setMessages(prevMessages => [...prevMessages, data.message]);
              setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
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
      } else if (contact && consultant && !ws) {
        
        try {
          const response = await fetch('/api/create-or-join-room', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('access')}`,
            },
            body: JSON.stringify({ username: contact.username, consultant : consultant , type : "with" })
          });

          if (!response.ok) {
            throw new Error('Failed to create or join room');
          }

          const data = await response.json();
          const roomName = data.name;
          setRoomName(roomName);
          const webSocket = new WebSocket(`wss://evtopback.liara.run/ws/chat/${roomName}/`);

          webSocket.onmessage = (e) => {
            const data = JSON.parse(e.data);

            if (data.type === 'initial_messages') {
              setMessages(data.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))); // معکوس کردن پیام‌ها تا جدیدترین پیام‌ها در پایین باشند
              if (data.messages.length < MESSAGES_BATCH_SIZE) {
                setHasMoreMessages(false);
              }
              setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            } else if (data.type === 'more_messages') {
              if (data.messages.length < MESSAGES_BATCH_SIZE) {
                setHasMoreMessages(false);
              }
              const sortedMessages = data.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
              const scrollTopBeforeFetch = chatContainerRef.current.scrollHeight;
              setMessages(prevMessages => [...sortedMessages, ...prevMessages]);
              setLoadingMessages(false);
              setTimeout(() => {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight - scrollTopBeforeFetch;
              }, 100);
            } else if (data.type === 'chat_message') {
              setMessages(prevMessages => [...prevMessages, data.message]);
              setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
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
  }, [contact, consultant,ws]);

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

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file && ws) {
      const formData = new FormData();
      formData.append('file', file);

      axios.post('/api/upload/', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(response => {

          ws.send(JSON.stringify({
            type: 'chat_message',
            message: response.data.file,
            username: localStorage.getItem('username')
          }));
        })
        .catch(error => console.error('Error uploading file:', error));
    } else {
      console.error('No file selected or WebSocket is not connected.');
    }
  };

  const handleSendMessage = () => {
    if (inputValue.trim() && ws) {
      ws.send(JSON.stringify({
        type: 'chat_message',
        message: inputValue,
        username: localStorage.getItem('username')
      }));
      setInputValue("");
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setInputValue(prevInput => prevInput + emojiObject.emoji);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  if (!contact && !consultant) {
    return (
      <div className="flex-grow hidden md:flex items-center justify-center bg-secondaryTextColor">
        <h2 className="text-2xl font-bold text-textColor">
          یکی از مخاطبین را برای شروع چت انتخاب کنید
        </h2>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-full flex-1 bg-secondaryTextColor">
      <div className="w-full p-5 border-b border-lightgray/45 flex items-center bg-secondaryTextColor">
        <button onClick={onBack} className="btn btn-circle btn-outline hover:bg-purple-500 mr-3 text-purple-500">
          <IoIosArrowBack />
        </button>
        <div className="avatar placeholder mr-3">
          <div className="btn rounded-badge glass bg-purple-500 text-secondaryTextColor">
            <span>{contact.username[0]}</span>
          </div>
        </div>
        <h2 className="text-xl text-gray/90 font-bold">{contact.username}</h2>
      </div>

      <div className="chat-container overflow-y-scroll flex-1" ref={chatContainerRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat flex flex-col p-5 ${msg.user === localStorage.getItem('username') ? 'chat-end' : 'chat-start'
              }`}
          >
            <div
              className={`chat-bubble break-all max-w-[90%] ${msg.user === localStorage.getItem('username') ? 'bg-purple-400 text-secondaryTextColor ' : 'bg-secondaryColor text-secondaryTextColor'
                }`}
            >
              {msg.content.startsWith('http') ? (
                msg.content.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                  <img src={msg.content} alt="uploaded" className="max-w-full h-auto" />
                ) : msg.content.match(/\.(mp4|webm|ogg)$/i) ? (
                  <video controls className="max-w-full h-auto">
                    <source src={msg.content} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <a href={msg.content} target="_blank" rel="noopener noreferrer" className="text-secondaryTextColor underline">
                    {msg.content.split('/uploads/')[1]}
                  </a>
                )
              ) : (
                msg.content
              )}
            </div>
            <p className="text-gray chat-footer pt-1">
              <MessageTimestamp timestamp={msg.timestamp} />
              {(msg.read && msg.user === localStorage.getItem('username')) && (
                <span className="text-primaryPurple pl-2">✔✔</span>
              ) || (!msg.read && msg.user === localStorage.getItem('username')) && (
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

      <div dir="rtl" className="w-full p-4 border-t flex items-center">
        <div
          className={`shadow-sm rounded-full p-3 ${inputValue ? 'bg-secondaryColor shadow-secondaryColor' : 'bg-primaryPurple shadow-secondaryColor disabled'
            }`}
          onClick={handleSendMessage}
        >
          <IoSend className="text-2xl cursor-pointer text-svgColor" />
        </div>

        <div className="absolute right-20 dropdown dropdown-top dropdown-start">
          <label htmlFor="file-upload" className="mr-3 flex">
            <AiOutlinePaperClip className="text-3xl text-svgColor hover:text-hoverColor" />
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        <input
          className="w-full p-3 pl-12 pr-16 mr-3 text-secondaryTextColor bg-purple-900/90 text-white rounded-full focus:outline-none"
          placeholder="پیام خود را وارد کنید..."
          value={inputValue}
          onChange={handleChange}
        />
        <button onClick={toggleEmojiPicker} className="absolute left-6 text-3xl hover:text-hoverColor">
          <MdOutlineEmojiEmotions />
        </button>
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
