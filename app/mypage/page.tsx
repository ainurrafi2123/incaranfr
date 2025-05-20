import Navbar from "../components/Navbar";
import ProfilePage from "../components/profile/ProfilePage";

export default function Profile() {
  return (
    <div>
      <Navbar />
      <div className="pt-16">
        <ProfilePage />
      </div>
    </div>
  );
}
