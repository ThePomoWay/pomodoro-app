import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.scss";
import AuthService from "./common/API/network/AuthService";
import { Sidebar } from "./common/components/sidebar/sidebar";
import { getUserAsync } from "./common/state/thunks/UserThunk";
import { syncIdb } from "./common/utils/sync";
import AboutUs from "./pages/about-us/AbousUsPage";
import AllTasks from "./pages/all-tasks/AllTasks";
import AnalysisPage from "./pages/analysis/Analysispage";
import Settings from "./pages/settings/Settings";
import CloseTabs from "./pages/close-tab/CloseTab";
import Homepage from "./pages/dashboard/HomePage";
import { init } from "./common/state/thunks/GlobalThunk";
import { Toast } from "./common/components/toast/Toast";
import { MultiTabAlertModal } from "./common/components/singe-tab-modal/MultiTabAlertModal";
import { PrivacyPolicy } from "./pages/privacy-policy/PrivacyPolicy";
import { TermsOfService } from "./pages/terms-of-service/TermsOfService";

import PricingModal from "./common/components/pricing-modal/PricingModal";

import { isExtensionPresent } from "./common/utils/extension-utils";
import { ExtensionModal } from "./common/components/extension-promotion-modal/ExtensionModal";
import WebsiteBlocker from "./common/components/website-blocker/WebsiteBlocker";
import { getIp } from "./common/API/network/SelfIpApi";
import {
  showTransactionErrorModal,
  showTransactionSuccessModal,
} from "./common/state/slice/GlobalSlice";
import { TransactionModal } from "./common/components/transaction-modal/TransactionModal";
import { PostTransactionHandler } from "./pages/post-transaction/PostTransactionHandler";

function App() {
  let dispatch = useDispatch();

  dispatch(init());

  // dispatch(showTransactionErrorModal());

  if (AuthService.isLoggedIn()) {
    dispatch(getUserAsync());
  }

  if (AuthService.isJustLoggedIn() && AuthService.isLoggedIn()) {
    syncIdb();
  }

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
        <Route path="/settings">
          <Settings />
        </Route>
        <Route path="/privacy-policy">
          <PrivacyPolicy />
        </Route>
        <Route path="/terms-of-service">
          <TermsOfService />
        </Route>
        <Route path="/manage">
          <WebsiteBlocker />
        </Route>
        <Route path="/success">
          <PostTransactionHandler />
        </Route>
        <Route path="/error">
          <PostTransactionHandler />
        </Route>
        <Route exact path="/">
          <Homepage />
        </Route>
      </Switch>
      <Toast />
      <MultiTabAlertModal />
      {!isExtensionPresent && <ExtensionModal />}

      <PricingModal />
      <TransactionModal />
    </Router>
  );
}

export default App;
