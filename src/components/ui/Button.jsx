import { Link } from "react-router";
import "./storefront.css";

export default function Button({
  to,
  variant = "primary",
  className = "",
  children,
  ...props
}) {
  const classes = `ui-button ui-button--${variant} ${className}`;
  return to ? (
    <Link to={to} className={classes} {...props}>
      {children}
    </Link>
  ) : (
    <button type="button" {...props} className={classes}>
      {children}
    </button>
  );
}
