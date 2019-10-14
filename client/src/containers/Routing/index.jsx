import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Homepage from '../../scenes/Homepage';
import RegistrationPage from '../../scenes/RegistrationPage';
import LoginPage from '../../scenes/LoginPage';
import Moving from '../../scenes/Moving';
import NotFound from '../../scenes/NotFound';

const Routing = () => {
  return (
    <Switch>
      <Route exact path="/" component={Homepage} />
      <Route exact path="/register" component={RegistrationPage} />
      <Route exact path="/login" component={LoginPage} />
      <Route exact path="/moving" component={Moving} />
      <Route exact path="*" component={NotFound} />
    </Switch>
  );
};

export default Routing;