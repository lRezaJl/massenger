"use client";
import { useState } from 'react';
import ContactList from '../components/ContactList';
import ChatArea from '../components/ChatArea';

const Home = () => {
  const [selectedContact, setSelectedContact] = useState(null);

  return (
    <div className="flex h-screen w-full justify-center items-center bg-secondaryTextColor ">
      <div className='max-w-[1024px] w-full h-[95%] flex border border-lightgray/45 divide-x divide-lightgray/45 '>
      <ContactList onSelectContact={setSelectedContact} />
      <ChatArea contact={selectedContact} />
      </div>
    </div>
  );
};

export default Home;
