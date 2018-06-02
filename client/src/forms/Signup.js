import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import { TextInput, Button } from './common';

class Signup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            email: '',
            password: '',
            confirm: '',
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

    handleEvent(e) {
        e.preventDefault();
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit(e) {
        e.preventDefault();
        const { name, email, confirm, password } = this.state;

        if (name.length > 4 && this.checkEmail(email) && password.length > 4 && confirm === password) {
            axios.post(`${process.env.REACT_APP_SERVER}/api/signup`, { name, email, password })
                .then((response) => {
                    if (response.data.success) {
                        this.setState({ error: 'Signup Successful!' }, () => {
                            setTimeout(() => {
                                this.props.history.push('/');
                            }, 4000);
                        });   
                    }
                    else {
                        this.setState({ error: response.data.message });   
                    }
                })
                .catch((err) => {
                    this.setState({ error: 'Error signing up' });
                })
        }
        else {
            this.setState({ error: 'Check text fields and try again (minimum 5 characters, valid email address)' });
        }
    }

    renderError() {
        return <div className="error text-center">{this.state.error}</div>;
    }

    checkEmail(value) {
        return value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
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
                                        <h5 className="mb-0">Sign Up</h5>
                                    </div>
                                    <div className="card-body">
                                        {this.renderError()}
                                        <form onSubmit={this.onSubmit}>
                                            <TextInput name="name" type="text" label="Your Name" value={this.state.name} onChange={this.handleEvent} />
                                            <TextInput name="email" type="text" label="Email Address" value={this.state.email} onChange={this.handleEvent} />
                                            <TextInput name="password" type="password" label="Password" value={this.state.password} onChange={this.handleEvent} />
                                            <TextInput name="confirm" type="password" label="Confirm Password" value={this.state.confirm} onChange={this.handleEvent} />
                                            <Button type="submit" name="btn-signup" label="Sign Up" />
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


export default connect(mapStateToProps)(Signup);
