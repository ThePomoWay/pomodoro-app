import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { getStatsAsync } from "../../common/state/slices/StatsSlice";
import { getUserAsync } from "../../common/state/slices/UserSlice";
import { AnalysisLaptop } from "./analysis-laptop/analysis-laptop";
import { AnalysisMobile } from "./analysis-mobile/analysis-mobile";

export default function AnalysisPage(props) {
  let dispatch = useDispatch();
    useEffect(() => {
        dispatch(getStatsAsync({}));
        dispatch(getUserAsync());
    });

    const isMobileDevice = useMediaQuery({
        query: "(min-device-width: 480px)",
      });
    
      const isTabletDevice = useMediaQuery({
        query: "(min-device-width: 768px)",
      });
    
      const isLaptop = useMediaQuery({
        query: "(min-device-width: 1024px)",
      });
    
      const isDesktop = useMediaQuery({
        query: "(min-device-width: 1200px)",
      });
    
      const isBigScreen = useMediaQuery({
        query: "(min-device-width: 1201px )",
      });

      if(isDesktop) {
          return (
              <AnalysisLaptop />
          )
      }
      return (
          <AnalysisMobile />
      )

    
}