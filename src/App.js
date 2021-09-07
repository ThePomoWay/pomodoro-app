import React from 'react';
import {  BrowserRouter as Router , Switch, Route } from 'react-router-dom';
import './App.css';
import { Sidebar } from './common/components/sidebar/sidebar';
import AboutUs from './pages/about-us/AbousUsPage';
import AnalysisPage from './pages/analysis/Analysispage';
import HomePage from './pages/dashboard/HomePage';

function App() {
  return (
    <Router>
      <Switch>
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
