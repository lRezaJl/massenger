"use client";
import { useState } from "react";
import { GrMicrophone } from "react-icons/gr";
import { AiOutlinePaperClip } from "react-icons/ai";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import { CiImageOn } from "react-icons/ci";

const ChatArea = ({ contact }) => {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (e) => {
    setInputValue(e.target.value);
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
    <div className="relative flex-1 text-white bg-gradient-to-b from-purple-100 via-purple-200 to-purple-300 ">
      <div className="w-full p-5 border-b flex items-center bg-purple-100 ">
        <div className="avatar placeholder online mr-3">
          <div className="btn rounded-badge glass bg-purple-500 text-secondaryTextColor">
            <span className="">{contact.avatar}</span>
          </div>
        </div>
        <h2 className="text-xl text-gray/90 font-bold">{contact.name}</h2>
      </div>
      <div className="chat chat-start">
        <div className="font-myfont chat-bubble text-secondaryTextColor ">
          سلام
        </div>
      </div>
      <div className="chat chat-start">
        <div className="chat-bubble  text-secondaryTextColor">چطور هستی؟</div>
      </div>
      <div className="chat chat-end">
        <div className="chat-bubble chat-bubble-accent text-gray">سلام</div>
      </div>
      <div className="chat chat-end">
        <div className="chat-bubble chat-bubble-accent text-gray">
          چطور هستی؟
        </div>
      </div>
      {/* Add more messages as needed */}

      <div
        dir="rtl"
        className="absolute bottom-0 w-full p-4 border-t border-purple-900 flex items-center"
      >
        <div
          className={` shadow-sm  rounded-full p-3
          ${
            inputValue
              ? "bg-blue shadow-blue"
              : "bg-primaryPurple shadow-secondaryColor"
          }
          `}
        >
          {inputValue ? (
            <IoSend className="text-2xl cursor-pointer text-svgColor" />
          ) : (
            <GrMicrophone className="text-2xl text-svgColor" />
          )}
        </div>

        <div className="absolute right-20 dropdown dropdown-top dropdown-start">
          <div tabIndex={0} role="button" className="mr-3">
            <AiOutlinePaperClip className="  text-3xl text-svgColor hover:text-hoverColor" />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-fit p-2 shadow"
          >
            <li>
              <div className="flex items-center">
                <CiImageOn className="text-2xl text-svgColor" />
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
        <MdOutlineEmojiEmotions className="absolute left-6 text-3xl  hover:text-hoverColor" />
      </div>
    </div>
  );
};

export default ChatArea;
