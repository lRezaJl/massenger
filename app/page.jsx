"use client";
import ContactList from "../components/ContactList";
import ChatArea from "../components/ChatArea";
import React, { useState } from "react";

const contacts = [
  { id: 1, name: "مهرداد لاجوردی", avatar: "م" },
  { id: 2, name: "مهرداد حسینی", avatar: "ح" },
  { id: 3, name: "سجاد محمدی", avatar: "س" },
  // Add more contacts as needed
];

const Home = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  return (
    <div
      className="flex h-screen  divide-x divide-white {
      white
    }"
    >
      <ContactList contacts={contacts} onSelectContact={setSelectedContact} />
      <ChatArea contact={selectedContact} />
    </div>
  );
};

export default Home;
