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

import "../src/styles/styles/index.less";

import PricingModal from "./common/components/pricing-modal/PricingModal";

import { useMediaQuery } from "react-responsive";
import { getIp } from "./common/API/network/SelfIpApi";
import { TransactionModal } from "./common/components/transaction-modal/TransactionModal";
import { MobileNavbar } from "./common/mobile-navbar/MobileNavbar";
import { lazy, Suspense } from "react";

const { SettingsMobile } = lazy(() =>
  import("./pages/settings-mobile/SettingsMobile")
);
const AboutUs = lazy(() => import("./pages/about-us/AbousUsPage"));
const AllTasks = lazy(() => import("./pages/all-tasks/AllTasks"));
const AnalysisPage = lazy(() => import("./pages/analysis/Analysispage"));
const CloseTabs = lazy(() => import("./pages/close-tab/CloseTab"));
const Homepage = lazy(() => import("./pages/dashboard/HomePage"));
const { LandingPage } = lazy(() => import("./pages/landing-page/LandingPage"));
const { PrivacyPolicy } = lazy(() =>
  import("./pages/privacy-policy/PrivacyPolicy")
);
const Settings = lazy(() => import("./pages/settings/Settings"));
const { TermsOfService } = lazy(() =>
  import("./pages/terms-of-service/TermsOfService")
);
const { PostTransactionHandler } = lazy(() =>
  import("./pages/post-transaction/PostTransactionHandler")
);

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
      <Suspense fallback={<div>Loading...</div>}>
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

          <Route exact path="/home">
            <Homepage />
          </Route>

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
      </Suspense>
    </Router>
  );
}

export default App;
