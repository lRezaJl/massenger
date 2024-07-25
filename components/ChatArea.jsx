const ChatArea = () => {
  return (
    <div className="flex-1 bg-gray-900 text-white flex flex-col justify-between">
      <div className="p-6 flex-1 overflow-y-auto">
        <div className="mb-4 p-4 bg-gray-800 rounded-lg max-w-xs">سلام</div>
        <div className="mb-4 p-4 bg-gray-800 rounded-lg max-w-xs">
          چطور هستی؟
        </div>
        {/* Add more messages as needed */}
      </div>
      <div className="p-4 border-t border-gray-700 flex items-center">
        <input
          className="flex-1 p-2 bg-gray-800 text-white rounded-full focus:outline-none"
          placeholder="پیام خود را وارد کنید..."
        />
      </div>
    </div>
  );
};

export default ChatArea;
