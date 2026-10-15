import { Link } from "react-router";
import logo from "../../assets/home/logo.png";

export default function Brand({ dark = false }) {
  return (
<<<<<<< HEAD
    <a
      href="/"
=======
    <Link
      to="/"
>>>>>>> 17a860a4b294322dcdb344b98c34d65bad6bd269
      aria-label="STROY UZ — главная"
      className={`inline-flex items-center gap-[7px] font-bold text-[28px] max-[767px]:text-[22px] leading-none whitespace-nowrap shrink-0 no-underline tracking-[-0.3px] hover:opacity-90 transition-opacity focus-visible:outline-[3px_solid_#b76b00] focus-visible:outline-offset-4 ${
        dark ? "text-white" : "text-[#19232e]"
      }`}
    >
      <img
        src={logo}
        alt=""
        width="32"
        height="32"
        className="w-8 h-8 max-[767px]:w-[26px] max-[767px]:h-[26px] object-contain shrink-0 block"
      />
      <span>
        STROY <span className="text-[#f59e0b]">UZ</span>
      </span>
    </Link>
  );
}

