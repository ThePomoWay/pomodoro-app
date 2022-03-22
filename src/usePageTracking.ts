import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga";

const usePageTracking = () => {
  const location = useLocation();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (window) {
      // if (!window.location.href.includes("beta")) {
      //   ReactGA.initialize("UA-000000000-0");
      // } else {
      //   ReactGA.initialize("UA-212261258-1");
      // }
      setInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (initialized && window.gtag) {
      // ReactGA.pageview(location.pathname + location.search);
      let pageTitle = "HomePage";
      if (location.pathname.startsWith("/all")) {
        pageTitle = "AllPage";
      }
      if (location.pathname.startsWith("/analysis")) {
        pageTitle = "AnalysisPage";
      }
      window.gtag("event", "page_view", {
        page_title: pageTitle,
        page_location: location.href,
        page_path: location.pathname,
      });
    }
  }, [initialized, location]);
};

export default usePageTracking;
