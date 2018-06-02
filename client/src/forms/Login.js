import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from './FormActions';

import { TextInput, Button } from './common';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            error: ''
        };

        this.handleEvent = this.handleEvent.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentWillMount() {
        if(this.props.auth) {
            if (this.props.auth.success) {
                this.props.history.push('/view');
            }
        }
    }

    componentWillUpdate(nextProps) {
        if(nextProps.auth) {
            if(nextProps.auth.success) {
                this.props.history.push('/view');
            }
        }
    }

    handleEvent(e) {
        e.preventDefault();
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit(e) {
        e.preventDefault();
        const { email, password } = this.state;

        if (email.length >= 4 && password.length >= 4 ) {
            this.setState({ error: '' }, () => {
                this.props.doLogin({ email, password });
            });
        }
        else {
            this.setState({ error: 'Invalid email or password' });
        }
    }

    renderError() {
        let error = this.state.error;
        if (this.props.auth) {
            if (!this.props.auth.success) {
                error = this.props.auth.message;
            }
        }
        return <div className="error text-center">{error}</div>;
    }

    render() {
        return (
            <div className="container forms-container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="row">
                            <div className="col-md-6 mx-auto">
                                <div className="card rounded-0">
                                    <div className="card-header">
                                        <h5 className="mb-0">Login</h5>
                                    </div>
                                    <div className="card-body">
                                        {this.renderError()}
                                        <form id="login" onSubmit={this.onSubmit}>
                                            <TextInput name="email" type="text" label="Email Address" value={this.state.email} onChange={this.handleEvent} />
                                            <TextInput name="password" type="password" label="Password" value={this.state.password} onChange={this.handleEvent} />
                                            <Button type="submit" name="btn-login" label="Login" />
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({ auth }) => {
    return { auth };
};

export default connect(mapStateToProps, actions)(Login);
