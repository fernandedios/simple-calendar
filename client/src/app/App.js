import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Header from './Header';
import Login from '../forms/Login';
import Signup from '../forms/Signup';
import AddSchedule from '../forms/AddSchedule';
import ViewSchedule from '../forms/ViewSchedule';
import Logout from '../forms/Logout';

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/add" component={AddSchedule} />
          <Route path="/view" component={ViewSchedule} />
          <Route path="/logout" component={Logout} />
        </Switch>
      </div>
    );
  }
}

export default App;
