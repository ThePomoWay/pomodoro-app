import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useMediaQuery } from "react-responsive";
import AuthService from "../../common/API/network/AuthService";
import { openOnboardingModal } from "../../common/state/slice/GlobalSlice";
import { getStatsAsync } from "../../common/state/thunks/StatsThunk";
import { getUserAsync } from "../../common/state/thunks/UserThunk";
import { AnalysisLaptop } from "./analysis-laptop/analysis-laptop";
import { AnalysisMobile } from "./analysis-mobile/analysis-mobile";

export default function AnalysisPage(props) {
  let dispatch = useDispatch();
  useEffect(() => {
    if (!AuthService.isLoggedIn()) {
      dispatch(openOnboardingModal());
    } else {
      dispatch(getStatsAsync({}));
      dispatch(getUserAsync());
    }
  });

  const isDesktop = useMediaQuery({
    query: "(min-device-width: 1200px)",
  });

  if (isDesktop) {
    return <AnalysisLaptop />;
  }
  return <AnalysisMobile />;
}
