import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import * as actions from './FormActions';
import { Button } from './common';

class ViewSchedule extends Component {
    constructor (props) {
        super(props);

        this.state = {
            render: false
        };

        this.widthArr = [];
        this.leftOffSet = [];
        this.collisions = [];

        this.renderJson = this.renderJson.bind(this);
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

    componentDidMount() {
        if (this.props.auth) {
            this.props.fetchTasks(this.props.auth.token);
        }
    }

    getCollisions(tasks) {
        this.collisions = [];
      
        for (let i = 0; i < 24; i ++) {
          let time = [];
          for (let j = 0; j < tasks.length; j++) {
            time.push(0);
          }
          this.collisions.push(time);
        }
      
        tasks.forEach(({ start, duration }, id) => {
          let end = start + duration;
          let order = 1;
      
          while (start < end) {
            let timeIndex = Math.floor(start/30);
      
            while (order < tasks.length) {
              if (this.collisions[timeIndex].indexOf(order) === -1) {
                break;
              }
              order ++;
            }
      
            this.collisions[timeIndex][id] = order;
            start = start + 30;
          }
      
          this.collisions[Math.floor((end-1)/30)][id] = order;
        });
    };

    getAttributes(tasks) {
        this.width = [];
        this.leftOffSet = [];
      
        for (let i = 0; i < tasks.length; i++) {
          this.widthArr.push(0);
          this.leftOffSet.push(0);
        }
      
        this.collisions.forEach((period) => {
          let count = period.reduce((a,b) => {
             return b ? a + 1 : a;
          });
      
          if (count > 1) {
            period.forEach((event, id) => {
              if (period[id]) {
                if (count > this.widthArr[id]) {
                    this.widthArr[id] = count;
                }
              }
      
              if (period[id] && !this.leftOffSet[id]) {
                this.leftOffSet[id] = period[id];
              }
            });
          }
        });
      };

    renderTasks() {
        const containerHeight = 720;
        const containerWidth = 600;
        const minutesinDay = 60 * 12;
        let tasks = [];

        if (this.props.tasks) {
            tasks = this.props.tasks.tasks;

            if (tasks.length > 0) {
                this.getCollisions(tasks);
                this.getAttributes(tasks);
            }
        }

        const divs = tasks.map(({ id, title, start, duration }, i) => {
            let end = start + duration;
            let height = ((end - start) / minutesinDay * containerHeight) + 'px';
            let top = (start / minutesinDay * (containerHeight + 220)) + 'px';
            let units = this.widthArr[i];
            if (!units) { units = 1 }
            let left = (containerWidth / this.widthArr[i]) * (this.leftOffSet[i] - 1) + 10;
            if (!left || left < 0) { left = 10 }
            let width = (containerWidth/units) + 'px';

            return (
                <Link to={`/edit/${id}`} key={title} className="event" style={{ width, height, top, left: 115 + left + 'px' }}>
                    <span className="title">{title}</span>
                </Link>
            );
        });
        return (
            <div className="days">
                {divs}
            </div>
        );
    }

    renderJson() {
        this.setState({ render: true });
    }

    renderJsonData() {
        if (this.state.render) {
            const filtered = this.props.tasks.tasks.map(({ start, duration, title }) => {
                return { start, duration, title };
            });

            return (
                <div className="form-group">
                    <textarea readOnly className="w-100 form-control" id="exampleFormControlTextarea1" rows="10" value={JSON.stringify(filtered)} />
                </div>
            );
        }
    }

    render() {
        return (
            <div className="container forms-container">
                <div className="row">
                    <div className="col">
                        <div className="times-container">
                            <div className="timings">
                                <div> <span> 8:00 </span> AM </div>
                                <div> 8:30 </div>
                                <div> <span> 9:00 </span>AM </div>
                                <div> 9:30 </div>
                                <div> <span> 10:00 </span>AM </div>
                                <div> 10:30 </div>
                                <div> <span> 11:00 </span>AM </div>
                                <div> 11:30 </div>
                                <div> <span> 12:00 </span>PM </div>
                                <div> 12:30 </div>
                                <div> <span> 1:00 </span>PM </div>
                                <div> 1:30 </div>
                                <div> <span> 2:00 </span>PM </div>
                                <div> 2:30 </div>
                                <div> <span> 3:00 </span>PM </div>
                                <div> 3:30 </div>
                                <div> <span> 4:00 </span>PM </div>
                                <div> 4:30 </div>
                                <div> <span> 5:00 </span>PM </div>
                            </div>
                            {this.renderTasks()}
                        </div>
                    </div>
                </div>
                <div className="row py-3">
                    <div className="col-md-5 mx-auto">
                        <Button onClick={this.renderJson} name="btn-export" label="Export to JSON" />
                    </div>
                </div>
                <div className="row">
                    <div className="col mx-auto">
                        {this.renderJsonData()}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ auth, tasks }) => {
    return { auth, tasks };
};


export default connect(mapStateToProps, actions)(ViewSchedule);
