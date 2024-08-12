"use client";
import { useState } from 'react';
import ContactList from '../components/ContactList';
import ChatArea from '../components/ChatArea';

const Home = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  
  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    setIsChatOpen(true);
  };

  const handleSelectConsultant = (consultant) => {
    setSelectedConsultant(consultant);
    setIsChatOpen(true);
  };

  const handleBack = () => {
    setSelectedContact(null);
    setSelectedConsultant(null);  
    setIsChatOpen(false);
  };

  const ClearConsultant = () => {
    setSelectedConsultant(null);  
  };

  return (
    <div className="flex h-screen w-full justify-center items-center bg-secondaryTextColor ">
      <div className='max-w-[1024px] w-full h-full md:h-[95%] flex border border-lightgray/45 divide-x divide-lightgray/45 '>
        <div className={`${isChatOpen ? 'hidden md:block' : 'block w-full md:w-fit'}`}>
          <ContactList onSelectContact={handleSelectContact} onConsultants={handleSelectConsultant} clear={ClearConsultant} />
        </div>
          <ChatArea contact={selectedContact} onBack={handleBack} consultant={selectedConsultant} />
      </div>
    </div>
  );
};

export default Home;
