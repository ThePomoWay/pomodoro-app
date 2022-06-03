import { useMediaQuery } from "react-responsive";
import NavbarDesktopNew from "./navbar-laptop/NavbarDesktopNew";

export default function NavbarNew(props) {
  const isMobileDevice = useMediaQuery({
    query: "(max-device-width: 480px)",
  });

  const isDesktop = useMediaQuery({
    query: "(min-device-width: 1200px)",
  });

  if (!isMobileDevice) {
    return <NavbarDesktopNew {...props} />;
  }

  return <></>;
}
