import { Link } from "react-router";
import logo from "../../assets/home/logo.png";
export default function Brand() {
  return (
    <Link className="home-brand" to="/#top" aria-label="STROY UZ — главная">
      <img src={logo} alt="" width="32" height="32" />
      STROY <span>UZ</span>
    </Link>
  );
}
