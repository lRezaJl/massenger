"use client";
import { useState } from 'react';
import ContactList from '../components/ContactList';
import ChatArea from '../components/ChatArea';

const Home = () => {
  const [selectedContact, setSelectedContact] = useState(null);

  return (
    <div className="flex h-screen divide-x divide-white">
      <ContactList onSelectContact={setSelectedContact} />
      <ChatArea contact={selectedContact} />
    </div>
  );
};

export default Home;
