import React from 'react';
import {  BrowserRouter as Router , Switch, Route } from 'react-router-dom';
import './App.scss';
import { Sidebar } from './common/components/sidebar/sidebar';
import AboutUs from './pages/about-us/AbousUsPage';
import AnalysisPage from './pages/analysis/Analysispage';
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
          <Route path="/analysis">
            <AnalysisPage />
          </Route>
          <Route path="/">
            <HomePage />
          </Route>
        </Switch>
    </Router>
  );
}

export default App;
