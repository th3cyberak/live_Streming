import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { signIn, signOut } from '../actions';

class Header extends React.Component {
  renderAuthButton() {
    if (this.props.isSignedIn) {
      return (
        <button onClick={this.props.signOut} className="ui red button">
          Sign Out
        </button>
      );
    } else {
      return (
        <button onClick={this.props.signIn} className="ui green button">
          Sign In
        </button>
      );
    }
  }

  render() {
    return (
      <div className="ui secondary pointing menu">
        <Link to="/" className="item">
          Streamy
        </Link>
        <div className="right menu">
          {this.renderAuthButton()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { isSignedIn: state.auth.isSignedIn };
};

export default connect(mapStateToProps, { signIn, signOut })(Header);
