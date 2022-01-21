import React from 'react';
import { useDispatch } from 'react-redux';
import {  BrowserRouter as Router , Switch, Route } from 'react-router-dom';
import './App.scss';
import AuthService from './common/API/network/AuthService';
import { Sidebar } from './common/components/sidebar/sidebar';
import { getUserAsync } from './common/state/slices/UserSlice';
import { syncIdb } from './common/utils/sync';
import AboutUs from './pages/about-us/AbousUsPage';
import AllTasks from './pages/all-tasks/AllTasks';
import AnalysisPage from './pages/analysis/Analysispage';
import ClockSettings from './pages/clock-settings/ClockSettings';
import CloseTabs from './pages/close-tab/CloseTab';
import Homepage from './pages/dashboard/Homepage';

function App() {

  let dispatch = useDispatch();
  if(AuthService.isLoggedIn()) {
    dispatch(getUserAsync());
  }

  if(AuthService.isJustLoggedIn() && AuthService.isLoggedIn()) {
    syncIdb();
  }

  return (
    <Router>
      <Switch>
          {/* <Route path="/onboarding">
            <OnBoarding />
          </Route> */}
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
          <Route exact path="/clock/settings">
            <ClockSettings />
          </Route>
          <Route exact path="/">
            <Homepage />
          </Route>
        </Switch>
    </Router>
  );
}

export default App;
