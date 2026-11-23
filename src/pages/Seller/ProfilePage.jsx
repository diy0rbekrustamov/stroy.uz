import ProfileForm from "../../components/account/ProfileForm.jsx";
import { useSession } from "../../api/useSession.js";
export default function ProfilePage() {
  const {user}=useSession();
  return user ? <ProfileForm key={user.id} user={user}/> : null;
}
