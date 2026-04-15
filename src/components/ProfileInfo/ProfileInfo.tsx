import { useUser } from "../../context/UserContext";
import { formatFrenchDate } from "../../utils/utils";

function ProfileInfo() {
  const { user } = useUser();

  return (
    <div className="">
      <h3>
        {user?.profile.firstName ?? ""} {user?.profile.lastName ?? ""}
      </h3>
      <p className="mb-0">
        Membre depuis le {formatFrenchDate(user?.profile.createdAt || "")}
      </p>
    </div>
  );
}
export default ProfileInfo;
