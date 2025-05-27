import React from 'react';
import { Field, reduxForm } from 'redux-form';

class StreamForm extends React.Component {
  renderError({ error, touched }) {
    if (touched && error) {
      return (
        <div className="ui error message">
          <div className="header">{error}</div>
        </div>
      );
    }
  }

  renderInput = ({ input, label, meta }) => {
    const className = `field ${meta.error && meta.touched ? 'error' : ''}`;
    return (
      <div className={className}>
        <label>{label}</label>
        <input {...input} autoComplete="off" />
        {this.renderError(meta)}
      </div>
    );
  };

  renderStreamKey = ({ input, label, meta }) => {
    const className = `field ${meta.error && meta.touched ? 'error' : ''}`;
    return (
      <div className={className}>
        <label>{label}</label>
        <div className="ui action input">
          <input 
            {...input} 
            readOnly 
            style={{ fontFamily: 'monospace' }}
            placeholder="Click Generate Key to create a stream key"
          />
          <button 
            type="button" 
            className="ui button"
            onClick={() => {
              const newKey = this.generateStreamKey();
              input.onChange(newKey);
            }}
          >
            Generate Key
          </button>
        </div>
        {this.renderError(meta)}
        <div className="ui info message">
          <p>This stream key will be used to connect OBS to your stream. Keep it private!</p>
        </div>
      </div>
    );
  };

  generateStreamKey = () => {
    // Generate a more OBS-friendly stream key
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    const userId = this.props.userId || 'user';
    return `${userId}-${timestamp}-${randomStr}`;
  };

  onSubmit = formValues => {
    if (!formValues.streamKey) {
      formValues.streamKey = this.generateStreamKey();
    }
    this.props.onSubmit(formValues);
  };

  render() {
    return (
      <form
        onSubmit={this.props.handleSubmit(this.onSubmit)}
        className="ui form error"
      >
        <Field name="title" component={this.renderInput} label="Enter Title" />
        <Field
          name="description"
          component={this.renderInput}
          label="Enter Description"
        />
        <Field
          name="streamKey"
          component={this.renderStreamKey}
          label="Stream Key"
        />
        <div className="ui info message">
          <div className="header">OBS Setup Instructions</div>
          <p>After creating your stream, you'll need to:</p>
          <ol>
            <li>Open OBS</li>
            <li>Go to Settings → Stream</li>
            <li>Select "Custom" as the service</li>
            <li>Server: rtmp://your-server-ip/live</li>
            <li>Stream Key: [Your generated stream key]</li>
          </ol>
        </div>
        <button className="ui button primary">Submit</button>
      </form>
    );
  }
}

const validate = formValues => {
  const errors = {};

  if (!formValues.title) {
    errors.title = 'You must enter a title';
  }

  if (!formValues.description) {
    errors.description = 'You must enter a description';
  }

  return errors;
};

export default reduxForm({
  form: 'StreamForm',
  validate
})(StreamForm);
