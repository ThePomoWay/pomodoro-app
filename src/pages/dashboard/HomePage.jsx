import { useMediaQuery } from "react-responsive";
import { useHideOnFullScreen } from "../../common/components/hide-on-full-screen/useHideOnFullScreen";
import usePageTracking from "../../usePageTracking";
import { HomepageLaptop } from "./laptop/homepage-view";
import { HomepageMobile } from "./mobile/homepage-view-xs";

export default function Homepage() {
  usePageTracking();
  useHideOnFullScreen();
  const isMobileDevice = useMediaQuery({
    query: "(max-device-width: 899px)",
  });

  if (navigator.userAgent === "ReactSnap") {
    return <div></div>;
  }

  if (isMobileDevice) {
    return <HomepageMobile />;
  }
  return <HomepageLaptop />;
}
