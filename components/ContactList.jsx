// components/ContactList.jsx
import React, { useState } from "react";

const SideBar = ({ contacts, onSelectContact }) => {
  const [selectedContact, setSelectedContact] = useState(null);

  const handleClick = (contact) => {
    setSelectedContact(contact.id);
    onSelectContact(contact);
  };

  return (
    <div className="w-64 h-screen p-4 bg-purple-100">
      <h2 className="text-lg font-bold mb-4 text-textColor">Contacts</h2>
      <ul className="mt-10">
        {contacts.map((contact) => (
          <li
            key={contact.id}
            className={`p-2 rounded-2xl mb-2 cursor-pointer ${
              selectedContact === contact.id
                ? "bg-primaryPurple text-secondaryTextColor font-semibold drop-shadow-md"
                : "bg-white"
            }`}
            onClick={() => handleClick(contact)}
          >
            <div className="flex items-center">
              <div className="avatar placeholder">
                <div
                  className={`btn rounded-badge glass  
                  ${
                    selectedContact === contact.id
                      ? "bg-purple-200 text-textColor hover:text-secondaryTextColor"
                      : "bg-purple-500 text-secondaryTextColor"
                  }
                  `}
                >
                  <span className="">{contact.avatar}</span>
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
