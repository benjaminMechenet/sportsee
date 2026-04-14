import { useUser } from "../../context/UserContext";
import "./ProfilePicture.css";

function ProfilePicture() {
  const { user } = useUser();

  return (
    <div className="pp-holder rounded-3 d-flex align-items-center justify-content-center">
      <img
        src={user?.profile.profilePicture ?? "/avatar.png"}
        className="d-block w-100 h-auto"
        alt="image de profil"
      />
    </div>
  );
}
export default ProfilePicture;
