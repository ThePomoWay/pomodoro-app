import { useMediaQuery } from "react-responsive";
import { HomepageLaptop } from "./laptop/homepage-view";
import { HomepageMobile } from "./mobile/homepage-view-xs";

export default function Homepage() {
    const isMobileDevice = useMediaQuery({
        query: "(max-device-width: 0px)",
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
              <HomepageLaptop />
          )
      }

      else {
          return (
              <HomepageMobile />
          )
      }
      
}