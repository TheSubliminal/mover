import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const PrivateRoute = ({ isAuthorized, location, ...props }) => (
  isAuthorized
    ? <Route {...props} render={({ Component, ...rest }) => <Component {...rest} />} />
    : <Redirect to={{ pathname: '/login', state: { from: location } }} />
);

PrivateRoute.propTypes = {
  isAuthorized: PropTypes.bool,
  location: PropTypes.any
};

PrivateRoute.defaultProps = {
  isAuthorized: false,
  location: undefined
};

const mapStateToProps = ({ profile: { isAuthorized, loading } }) => ({
  isAuthorized,
  loading
});

export default connect(mapStateToProps)(PrivateRoute);
