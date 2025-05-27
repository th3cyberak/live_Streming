import React from 'react';
import { connect } from 'react-redux';

import { signIn, signOut } from '../actions';

class GoogleAuth extends React.Component {
  state = { isGapiLoaded: false };

  componentDidMount() {
    // Check if gapi is already loaded
    if (window.gapi) {
      this.initializeGapi();
    } else {
      // If not loaded, wait for the script to load
      const checkGapi = setInterval(() => {
        if (window.gapi) {
          clearInterval(checkGapi);
          this.initializeGapi();
        }
      }, 100);
    }
  }

  initializeGapi = () => {
    window.gapi.load('client:auth2', () => {
      window.gapi.client
        .init({
          clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || '930209828697-5ir1895m9j2ain2atha8vfi47mdqkruh.apps.googleusercontent.com',
          scope: 'email'
        })
        .then(() => {
          this.auth = window.gapi.auth2.getAuthInstance();
          this.onAuthChange(this.auth.isSignedIn.get());
          this.auth.isSignedIn.listen(this.onAuthChange);
          this.setState({ isGapiLoaded: true });
        })
        .catch(err => {
          console.error('Error initializing Google Auth:', err);
        });
    });
  };

  onAuthChange = isSignedIn => {
    if (isSignedIn) {
      this.props.signIn(this.auth.currentUser.get().getId());
    } else {
      this.props.signOut();
    }
  };

  onSignInClick = () => {
    if (this.auth) {
      this.auth.signIn();
    }
  };

  onSignOutClick = () => {
    if (this.auth) {
      this.auth.signOut();
    }
  };

  renderAuthButton() {
    if (!this.state.isGapiLoaded) {
      return (
        <button className="ui red google button" disabled>
          <i className="google icon" />
          Loading...
        </button>
      );
    }

    if (this.props.isSignedIn === null) {
      return null;
    } else if (this.props.isSignedIn) {
      return (
        <button onClick={this.onSignOutClick} className="ui red google button">
          <i className="google icon" />
          Sign Out
        </button>
      );
    } else {
      return (
        <button onClick={this.onSignInClick} className="ui red google button">
          <i className="google icon" />
          Sign In with Google
        </button>
      );
    }
  }

  render() {
    return <div>{this.renderAuthButton()}</div>;
  }
}

const mapStateToProps = state => {
  return { isSignedIn: state.auth.isSignedIn };
};

export default connect(mapStateToProps, { signIn, signOut })(GoogleAuth);
