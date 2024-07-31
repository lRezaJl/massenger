// components/ContactList.jsx
import React, { useState } from "react";

const SideBar = ({ contacts, onSelectContact }) => {
  const [selectedContact, setSelectedContact] = useState(null);

  const handleClick = (contact) => {
    setSelectedContact(contact.id);
    onSelectContact(contact);
  };

  return (
    <div className="w-64 bg-purple-50 h-screen p-4">
      <h2 className="text-lg font-bold mb-4 ">Contacts</h2>
      <ul className="mt-10">
        {contacts.map((contact) => (
          <li
            key={contact.id}
            className={`p-2 rounded-2xl mb-2 cursor-pointer ${
              selectedContact === contact.id
                ? "bg-purple-500 text-white"
                : "bg-white"
            }`}
            onClick={() => handleClick(contact)}
          >
            <div className="flex items-center">
              <div className="avatar placeholder">
                <div className="bg-neutral text-neutral-content w-8 rounded-full">
                  <span>{contact.avatar}</span>
                </div>
              </div>
              <span
                className={` ml-2 ${
                  selectedContact === contact.id
                    ? "text-secondaryTextColor"
                    : "text-textColor"
                }`}
              >
                {contact.name}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideBar;
