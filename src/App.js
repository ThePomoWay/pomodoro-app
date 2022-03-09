import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {  BrowserRouter as Router , Switch, Route } from 'react-router-dom';
import './App.scss';
import AuthService from './common/API/network/AuthService';
import { Sidebar } from './common/components/sidebar/sidebar';
import { getUserAsync } from './common/state/thunks/UserThunk';
import { syncIdb } from './common/utils/sync';
import AboutUs from './pages/about-us/AbousUsPage';
import AllTasks from './pages/all-tasks/AllTasks';
import AnalysisPage from './pages/analysis/Analysispage';
import Settings from './pages/settings/Settings';
import CloseTabs from './pages/close-tab/CloseTab';
import Homepage from './pages/dashboard/HomePage';
import { init } from './common/state/thunks/GlobalThunk';
import { Toast } from './common/components/toast/Toast';


function App() {

  let dispatch = useDispatch();
  
  if(AuthService.isLoggedIn()) {
    dispatch(getUserAsync());
  }

  dispatch(init());

  if(AuthService.isJustLoggedIn() && AuthService.isLoggedIn()) {
    syncIdb();
  }

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
          <Route exact path="/">
            <Homepage />
          </Route>
        </Switch>
        <Toast />
    </Router>
  );
}

export default App;
