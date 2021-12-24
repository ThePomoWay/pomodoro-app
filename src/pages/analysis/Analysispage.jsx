import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { AnalysisLaptop } from "./analysis-laptop/analysis-laptop";
import { AnalysisMobile } from "./analysis-mobile/analysis-mobile";



export default function AnalysisPage(props) {
    useEffect(() => {
        //getStats();
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