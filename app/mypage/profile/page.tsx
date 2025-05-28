import Navbar from "../../components/Navbar";
import OrderTable from "../../components/ui/OrderTable";

const page = () => {
  return (
    <div>
      <Navbar />
      <div className="pt-16">
        <OrderTable />
      </div>
    </div>
  );
};

export default page;
