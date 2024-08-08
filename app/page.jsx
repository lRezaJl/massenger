"use client";
import { useState } from 'react';
import ContactList from '../components/ContactList';
import ChatArea from '../components/ChatArea';

const Home = () => {
  const [selectedContact, setSelectedContact] = useState(null);

  return (
    <div className="flex h-screen w-full justify-center items-center bg-purple-900 divide-x divide-white">
      <div className='w-full h-full flex '>
      <ContactList onSelectContact={setSelectedContact} />
      <ChatArea contact={selectedContact} />
      </div>
    </div>
  );
};

export default Home;
