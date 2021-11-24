import React from 'react';
import {  BrowserRouter as Router , Switch, Route } from 'react-router-dom';
import './App.scss';
import { Sidebar } from './common/components/sidebar/sidebar';
import AboutUs from './pages/about-us/AbousUsPage';
import AllTasks from './pages/all-tasks/AllTasks';
import AnalysisPage from './pages/analysis/Analysispage';
import ClockSettings from './pages/clock-settings/ClockSettings';
import CloseTabs from './pages/close-tab/CloseTab';
import HomePage from './pages/dashboard/HomePage';
import OnBoarding from './pages/onboarding/Onboarding';

function App() {
  return (
    <Router>
      <Switch>
          <Route path="/onboarding">
            <OnBoarding />
          </Route>
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
          <Route exact path="/clock/settings">
            <ClockSettings />
          </Route>
          <Route exact path="/">
            <HomePage />
          </Route>
        </Switch>
    </Router>
  );
}

export default App;
