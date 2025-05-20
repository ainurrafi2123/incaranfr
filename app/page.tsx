import Navbar from "./components/Navbar";
import Soon from "./components/ui/Soon";

const Page = () => {
  return (
    <div>
      <Navbar />
      <div className="pt-16">
        <Soon />
      </div>
    </div>
  );
};

export default Page;
