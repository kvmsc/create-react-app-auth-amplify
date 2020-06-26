import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { API, Auth } from "aws-amplify";

export default class CreateEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formSubmitted: false,
      userId: "",
      userIdfound: false,
      formData: {
        name: "",
        description: "",
        status: "",
        start_date: "",
        start_time: "",
        end_date: "",
        end_time: "",
      },
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount = () => {
    if (!this.state.userIdfound) {
      Auth.currentUserInfo().then((result) => {
        this.setState({ userId: result.username, userIdfound: true });
      });
    }
  };

  eventCreate = async () => {
    try {
      const apiName = "event-scheduler-api";
      const path = "/create-event";
      const myInit = {
        body: {
          item: {
            UserId: this.state.userId,
            EventName: this.state.formData.name,
            EventDescription: this.state.formData.description,
            EventStatus: this.state.formData.status,
            EventSchedule: {
              Start_time:
                this.state.formData.start_time +
                " " +
                this.state.formData.start_date,
              Stop_time:
                this.state.formData.end_time +
                " " +
                this.state.formData.end_date,
            },
          },
        },
      };
      const response = await API.post(apiName, path, myInit);

      //Logging  The response
      console.log(response);

      //the data in App State is now Stale
      this.props.consistency.setConsistency(false);
    } catch (err) {
      console.log(err);
    }
  };

  handleSubmit(event) {
    event.preventDefault();
    this.eventCreate().then(() => {
      this.setState({ formSubmitted: true });
    });
  }

  handleChange(event) {
    //console.log(this.state.formData.name);
    let updatedFormData = { ...this.state.formData };
    updatedFormData[event.target.name] = event.target.value;
    this.setState({ formData: updatedFormData });
    //console.log(this.state.formData.name);
  }
  render() {
    console.log(this.state.userId);
    //Redirect to Home page After form Submission
    if (this.state.formSubmitted) {
      return <Redirect to="/" />;
    }

    const {
      name,
      description,
      status,
      start_date,
      start_time,
      end_date,
      end_time,
    } = this.state.formData;

    return (
      <div className="container contact-form">
        <form onSubmit={this.handleSubmit}>
          <h3>Create New Event!</h3>
          <div className="row">
            <div className="col-12">
              <div className="form-group">
                <input
                  className="form-control"
                  type="text"
                  name="name"
                  value={name}
                  onChange={this.handleChange}
                  placeholder="Event Name"
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  name="description"
                  value={description}
                  className="form-control"
                  placeholder="Event Description"
                  onChange={this.handleChange}
                ></textarea>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-7">
              <div className="form-group">
                <label for="start_date">Start Date:</label>
                <input
                  className="form-control"
                  type="date"
                  name="start_date"
                  value={start_date}
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
                  value={start_time}
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
                  value={end_date}
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
                  value={end_time}
                  onChange={this.handleChange}
                  id="end_time"
                />
              </div>
            </div>
            <div className="col-12">
              <div className="form-group">
                <label for="select">Status:</label>
                <select
                  className="custom-select"
                  name="status"
                  value={status}
                  onChange={this.handleChange}
                  required
                  id="select"
                >
                  <option value="">Select One</option>
                  <option value="Idle">Idle</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Finished">Finished</option>
                </select>
              </div>
              <div className="form-group">
                <input type="submit" className="btnContact" value="Create" />
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
