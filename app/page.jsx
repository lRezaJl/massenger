import SideBar from "../components/SideBar";
import ChatArea from "../components/ChatArea";

const Home = () => {
  return (
    <div className="flex h-screen">
      <SideBar />
      <ChatArea />
    </div>
  );
};

export default Home;
