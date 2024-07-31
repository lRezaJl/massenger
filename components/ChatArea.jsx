"use client";
import { useState } from "react";
import { GrMicrophone } from "react-icons/gr";
import { AiOutlinePaperClip } from "react-icons/ai";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { CiImageOn } from "react-icons/ci";

const ChatArea = ({ contact }) => {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  if (!contact) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <h2 className="text-2xl">یکی از مخاطبین را برای شروع چت انتخاب کنید</h2>
      </div>
    );
  }

  return (
    <div className="relative flex-1 text-white">
      <div className="w-full p-5 bg-purple-50 border-b flex items-center">
        <h2 className="text-xl font-bold">{contact.name}</h2>
      </div>
      <div className="chat chat-start">
        <div className="font-myfont chat-bubble">سلام</div>
      </div>
      <div className="chat chat-start">
        <div className="chat-bubble">چطور هستی؟</div>
      </div>
      <div className="chat chat-end">
        <div className="chat-bubble">سلام</div>
      </div>
      <div className="chat chat-end">
        <div className="chat-bubble">چطور هستی؟</div>
      </div>
      {/* Add more messages as needed */}

      <div
        dir="rtl"
        className="absolute bottom-0 w-full p-4 border-t border-gray-700 flex items-center"
      >
        {inputValue ? (
          <IoSend className="text-2xl cursor-pointer" />
        ) : (
          <GrMicrophone className="text-2xl" />
        )}

        <div className="dropdown dropdown-top dropdown-start">
          <div tabIndex={0} role="button" className="mr-3">
            <AiOutlinePaperClip className="text-3xl" />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-fit p-2 shadow"
          >
            <li>
              <div className="flex items-center">
                <CiImageOn className="text-2xl" />
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
          className="w-full p-3 mr-3 bg-gray-900 text-white rounded-full focus:outline-none"
          placeholder="پیام خود را وارد کنید..."
          value={inputValue}
          onChange={handleChange}
        />
        <MdOutlineEmojiEmotions className="absolute left-6 text-3xl" />
      </div>
    </div>
  );
};

export default ChatArea;
