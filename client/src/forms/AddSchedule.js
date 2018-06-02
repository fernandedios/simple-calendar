import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import * as actions from './FormActions';
import { TextInput, Button } from './common';

class AddSchedule extends Component {
    constructor(props) {
        super(props);

        this.state = {
            start: '',
            duration: '',
            title: ''
        };

        this.handleEvent = this.handleEvent.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentWillMount() {
        if(this.props.auth) {
            if (!this.props.auth.success) {
                this.props.history.push('/');
            }
        }
        else {
            this.props.history.push('/');
        }
    }

    handleEvent(e) {
        e.preventDefault();
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit(e) {
        e.preventDefault();
        const { title, start, duration } = this.state;

        if (title.length >= 4 && start !== '' && duration !== '') {
            const headers = { 'Authorization': this.props.auth.token };
            const converted = this.convertTime(start);

            const data = { title, start: converted, duration };

            axios.post(`${process.env.REACT_APP_SERVER}/api/tasks`, data, { headers })
                .then((res) => {
                    if (res.data.success) {
                        this.props.history.push('/view');
                    }
                })
                .catch((err) => {
                    this.setState({ error: 'Error adding task' });
                    console.log(err);
                });
        }
        else {
            this.setState({ error: 'Check text fields and try again (title needs minimum 5 characters)' });
        }
    }

    convertTime(val) {
        const baseline = 480;
        const diem = String(val).substr(-2);
        const arr = val.split(':');
        
        let hours = parseInt(arr[0], 10);
        if (diem.toLowerCase() === 'pm'){
            hours += 12;
        }

        const minutes = hours * 60 + (parseInt(arr[1].substr(0, 2), 10));
        return minutes - baseline;
    }

    renderError() {
        return <div className="error text-center">{this.state.error}</div>;
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
                                        <h5 className="mb-0">Add New Schedule</h5>
                                    </div>
                                    <div className="card-body">
                                        {this.renderError()}
                                        <form onSubmit={this.onSubmit}>
                                            <TextInput name="title" type="text" label="Title" value={this.state.title} onChange={this.handleEvent} />
                                            <TextInput name="start" type="text" label="Start" placeholder="8:00am" value={this.state.start} onChange={this.handleEvent} />
                                            <TextInput name="duration" type="text" label="Duration" value={this.state.duration} onChange={this.handleEvent} />
                                            <Button type="submit" name="btn-add" label="Add to Schedule" />
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ auth, tasks }) => {
    return { auth, tasks };
};

export default connect(mapStateToProps, actions)(AddSchedule);
