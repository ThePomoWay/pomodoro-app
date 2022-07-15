import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.scss";
import AuthService from "./common/API/network/AuthService";
import { NotFound } from "./common/components/404/404";
import { ExtensionModal } from "./common/components/extension-promotion-modal/ExtensionModal";
import { Sidebar } from "./common/components/sidebar/sidebar";
import { MultiTabAlertModal } from "./common/components/singe-tab-modal/MultiTabAlertModal";
import { Toast } from "./common/components/toast/Toast";
import { TutorialModal } from "./common/components/tutorial-modal/TutorialModal";
import WebsiteBlocker from "./common/components/website-blocker/WebsiteBlocker";
import { init } from "./common/state/thunks/GlobalThunk";
import { getUserAsync } from "./common/state/thunks/UserThunk";
import { LANDING_PAGE_CLOSE } from "./common/utils/constants";
import { isExtensionPresent } from "./common/utils/extension-utils";
import { syncIdb } from "./common/utils/sync";
import AboutUs from "./pages/about-us/AbousUsPage";
import AllTasks from "./pages/all-tasks/AllTasks";
import AnalysisPage from "./pages/analysis/Analysispage";
import CloseTabs from "./pages/close-tab/CloseTab";
import Homepage from "./pages/dashboard/HomePage";
import { LandingPage } from "./pages/landing-page/LandingPage";
import { PrivacyPolicy } from "./pages/privacy-policy/PrivacyPolicy";
import Settings from "./pages/settings/Settings";
import { TermsOfService } from "./pages/terms-of-service/TermsOfService";

import { PostTransactionHandler } from "./pages/post-transaction/PostTransactionHandler";

import "../src/styles/styles/index.less";

import PricingModal from "./common/components/pricing-modal/PricingModal";

import { getIp } from "./common/API/network/SelfIpApi";
import { TransactionModal } from "./common/components/transaction-modal/TransactionModal";
import { useMediaQuery } from "react-responsive";
import { MobileNavbar } from "./common/mobile-navbar/MobileNavbar";
import { SettingsMobile } from "./pages/settings-mobile/SettingsMobile";
import { DesktopPromotion } from "./common/components/desktop-promotion/DesktopPromotion";

function App() {
  let dispatch = useDispatch();

  dispatch(init());

  const isMobileDevice = useMediaQuery({
    query: "(max-device-width: 899px)",
  });

  // dispatch(showTransactionErrorModal());

  if (AuthService.isLoggedIn()) {
    dispatch(getUserAsync());
  }

  if (AuthService.isJustLoggedIn() && AuthService.isLoggedIn()) {
    syncIdb();
  }

  let isLoggedIn = AuthService.isLoggedIn();
  let isLandingPageVisited = localStorage.getItem(LANDING_PAGE_CLOSE);
  // getting users country code on page load and storing in LS
  getIp();

  return (
    <Router>
      <Switch>
        <Route path="/closetabs">
          <CloseTabs></CloseTabs>
        </Route>
        <Route path="/about-us">
          <Sidebar />
          <AboutUs />
        </Route>
        <Route path="/all">
          <AllTasks />
        </Route>
        <Route exact path="/analysis">
          <AnalysisPage />
        </Route>
        {!isMobileDevice && (
          <Route path="/settings">
            <Settings />
          </Route>
        )}
        {isMobileDevice && (
          <Route path="/settings">
            <SettingsMobile />
          </Route>
        )}

        <Route path="/privacy-policy">
          <PrivacyPolicy />
        </Route>
        <Route path="/terms-of-service">
          <TermsOfService />
        </Route>
        <Route path="/manage">
          <WebsiteBlocker />
        </Route>
        {!isMobileDevice && (
          <Route path="/app">
            <Homepage />
          </Route>
        )}

        <Route path="/success">
          <PostTransactionHandler />
        </Route>
        <Route path="/failure">
          <PostTransactionHandler />
        </Route>

        {!isMobileDevice && (
          <Route exact path="/">
            {!isLoggedIn && !isLandingPageVisited ? (
              <LandingPage />
            ) : (
              <Homepage />
            )}
            {/* <LandingPage /> */}
          </Route>
        )}

        {isMobileDevice && (
          <Route exact path="/">
            <Homepage />
          </Route>
        )}

        <Route path="">
          <NotFound />
        </Route>
      </Switch>
      <Toast />
      <MultiTabAlertModal />
      {!isMobileDevice && <TutorialModal />}
      {!isExtensionPresent && <ExtensionModal />}

      {isMobileDevice && <MobileNavbar />}

      <PricingModal />
      <TransactionModal />
    </Router>
  );
}

export default App;
