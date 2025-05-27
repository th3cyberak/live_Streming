import React from 'react';
import { connect } from 'react-redux';

import { createStream } from '../../actions';
import StreamForm from './StreamForm';

class StreamCreate extends React.Component {
  onSubmit = formValues => {
    // Ensure streamKey is included in the form values
    if (!formValues.streamKey) {
      formValues.streamKey = this.generateStreamKey();
    }
    this.props.createStream(formValues);
  };

  generateStreamKey = () => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    const userId = this.props.userId || 'user';
    return `${userId}-${timestamp}-${randomStr}`;
  };

  render() {
    return (
      <div>
        <h3>Create a Stream</h3>
        <StreamForm 
          onSubmit={this.onSubmit} 
          userId={this.props.userId}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { userId: state.auth.userId };
};

export default connect(mapStateToProps, { createStream })(StreamCreate);
