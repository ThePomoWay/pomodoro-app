import { useMediaQuery } from "react-responsive";
import NavbarDesktop from "./navbar-laptop/NavbarDesktop";
import NavbarMobile from "./navbar-mobile/NavbarMobile";

export default function Navbar(props) {
  const isMobileDevice = useMediaQuery({
    query: "(max-device-width: 480px)",
  });

  const isDesktop = useMediaQuery({
    query: "(min-device-width: 1200px)",
  });

  if (!isMobileDevice) {
    return <NavbarDesktop {...props} />;
  }

  return <NavbarMobile {...props} />;
}
