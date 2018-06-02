import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { doLogout } from './FormActions';

class Logout extends Component {
    componentWillMount() {
        this.props.doLogout();
    }

    render() {
        return (
            <Redirect to="/" />
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
      doLogout: () => dispatch(doLogout())
    };
  };

const mapStateToProps = ({ auth }) => {
    return { auth };
  };

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
