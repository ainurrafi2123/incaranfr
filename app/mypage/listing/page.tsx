import Navbar from "../../components/Navbar";
import TableProduct from "../../components/ui/TableProduct";

export default function Profile() {
  return (
    <div>
      <Navbar />
      <div className="pt-16">
        <TableProduct />
      </div>
    </div>
  );
}
