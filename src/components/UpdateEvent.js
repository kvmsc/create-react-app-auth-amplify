import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { API } from "aws-amplify";

export default class UpdateEvent extends Component {
  //Constructing props to bind 'this' to submit Handler
  constructor(props) {
    super(props);
    this.state = {
      formSubmitted: false,
      injectedState: this.props.location.state,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  eventUpdate = async () => {
    try {
      const apiName = "event-scheduler-api";
      const path = "/event-update";
      const myInit = {
        body: {
          item: this.state.injectedState.event,
        }, // OPTIONAL
      };
      const response = await API.post(apiName, path, myInit);

      //Logging  The response
      console.log(response);

      //Since Updated the data in App State is Stale
      this.props.consistency.setConsistency(false);
    } catch (err) {
      console.log(err);
    }
  };

  //Change Handler
  handleChange(event) {
    let tempState = JSON.parse(JSON.stringify(this.state.injectedState));
    //console.log(tempState);
    tempState.event.EventStatus = event.target.value;
    this.setState({ injectedState: tempState });
  }

  //Submit handler
  handleSubmit(event) {
    event.preventDefault();
    this.eventUpdate().then(() => {
      this.setState({ formSubmitted: true });
    });
  }

  render() {
    //Redirect to Home page After form Submission or Illegal access
    if (!this.state.injectedState || this.state.formSubmitted) {
      return <Redirect to="/" />;
    }
    const currentEvent = this.state.injectedState.event;
    return (
      <div className="container contact-form">
        <form onSubmit={this.handleSubmit}>
          <h3>Update Event - {currentEvent.EventName}</h3>
          <div className="row">
            <div className="col-7">
              <div className="form-group">
                <label for="start_date">Start Date:</label>
                <input
                  className="form-control"
                  type="date"
                  name="start_date"
                  value={currentEvent.EventSchedule.Start_time.slice(-10)}
                  onChange={this.handleChange}
                  id="start_date"
                />
              </div>

              <div className="form-group">
                <label for="start_time">Start Time:</label>
                <input
                  className="form-control"
                  type="time"
                  name="start_time"
                  value={currentEvent.EventSchedule.Start_time.slice(0, -11)}
                  onChange={this.handleChange}
                  id="start_time"
                />
              </div>
            </div>

            <div className="col-5">
              <div className="form-group">
                <label for="end_date">End Date:</label>
                <input
                  className="form-control"
                  type="date"
                  name="end_date"
                  value={currentEvent.EventSchedule.Stop_time.slice(-10)}
                  onChange={this.handleChange}
                  id="end_date"
                />
              </div>
              <div className="form-group">
                <label for="end_time">End Time:</label>
                <input
                  className="form-control"
                  type="time"
                  name="end_time"
                  value={currentEvent.EventSchedule.Stop_time.slice(0, -11)}
                  onChange={this.handleChange}
                  id="end_time"
                />
              </div>
            </div>
            <div className="col-12">
              <div className="form-group">
                <label for="formSelectInput">Status:</label>
                <select
                  id="formSelectInput"
                  className="browser-default custom-select"
                  name="status"
                  value=""
                  onChange={this.handleChange}
                  required
                >
                  <option value="">Select One</option>
                  <option
                    value="Idle"
                    disabled={currentEvent.EventStatus === "Idle"}
                  >
                    Idle
                  </option>
                  <option
                    value="Ongoing"
                    disabled={currentEvent.EventStatus === "Ongoing"}
                  >
                    Ongoing
                  </option>
                  <option
                    value="Finished"
                    disabled={currentEvent.EventStatus === "Finished"}
                  >
                    Finished
                  </option>
                </select>
              </div>
              <div className="form-group">
                <input type="submit" className="btnContact" value="Update" />
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
