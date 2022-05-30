import { useMediaQuery } from "react-responsive";
import usePageTracking from "../../usePageTracking";
import { HomepageLaptop } from "./laptop/homepage-view";
import { HomepageMobile } from "./mobile/homepage-view-xs";

export default function Homepage() {
  usePageTracking();
  const isMobileDevice = useMediaQuery({
    query: "(max-device-width: 899px)",
  });

  const isDesktop = useMediaQuery({
    query: "(min-device-width: 900px)",
  });

  if (navigator.userAgent === "ReactSnap") {
    return <div></div>;
  }

  if (isMobileDevice) {
    return <HomepageMobile />;
  }
  return <HomepageLaptop />;
}
