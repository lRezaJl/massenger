"use client";
const contacts = [
  { id: 1, name: "مهرداد لاجوردی", avatar: "م" },
  { id: 2, name: "مهرداد حسینی", avatar: "ح" },
  { id: 3, name: "صباح ریوه", avatar: "ص" },
  // Add more contacts as needed
];

const Sidebar = ({ onSelectContact }) => {
  const [selectedContact, setSelectedContact] = "";

  const handleClick = (contact) => {
    setSelectedContact(contact.id);
    onSelectContact(contact);
  };

  return (
    <div className="w-72 bg-gray-800 text-white h-screen overflow-y-auto">
      {contacts.map((contact) => (
        <div
          key={contact.id}
          onClick={() => handleClick(contact)}
          className={`p-4 border-b border-gray-700 flex items-center cursor-pointer ${
            selectedContact === contact.id ? "bg-gray-700" : ""
          }`}
        >
          <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center mr-4">
            {contact.avatar}
          </div>
          <div className="text-lg">{contact.name}</div>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
