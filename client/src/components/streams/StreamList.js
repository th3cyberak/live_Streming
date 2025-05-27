import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { fetchStreams } from '../../actions';

class StreamList extends React.Component {
  componentDidMount = () => {
    this.props.fetchStreams();
  };

  renderAdmin(stream) {
    if (stream.userId === this.props.currentUserId) {
      return (
        <div className="right floated content">
          <Link to={`/streams/edit/${stream.id}`} className="ui button primary">
            Edit
          </Link>
          <Link
            to={`/streams/delete/${stream.id}`}
            className="ui button negative"
          >
            Delete
          </Link>
        </div>
      );
    }
  }

  renderList = () => {
    return this.props.streams.map(stream => {
      return (
        <div
          key={stream.id}
          onClick={() => window.location.href = `/streams/${stream.id}`}
          style={{
            background: 'linear-gradient(135deg, #fff0f6 0%, #ffe5ec 100%)',
            borderRadius: 16,
            boxShadow: '0 2px 16px 0 #0001',
            margin: '16px 0',
            padding: '18px 0 12px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            minWidth: 280,
            maxWidth: 350,
            width: '100%',
            cursor: 'pointer',
          }}
        >
          <div onClick={e => e.stopPropagation()}>{this.renderAdmin(stream)}</div>
          <div style={{ flex: 1, textAlign: 'center', fontWeight: 600, color: '#a12c2c' }}>
            {stream.title}
          </div>
          <div
            style={{
              background: '#181a20',
              color: '#fff',
              borderRadius: 8,
              padding: '6px 16px',
              fontWeight: 700,
              fontSize: 16,
              margin: '0 10px',
              minWidth: 60,
              textAlign: 'center',
              boxShadow: '0 2px 8px 0 #0002',
            }}
          >
            0:0
            <div style={{ fontSize: 12, fontWeight: 400 }}>13:00</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center', fontWeight: 600, color: '#a12c2c', position: 'relative' }}>
            <span>{stream.description}</span>
            <span
              style={{
                background: '#ff3b3b',
                color: '#fff',
                borderRadius: 6,
                padding: '2px 10px',
                fontSize: 12,
                fontWeight: 700,
                marginLeft: 8,
                position: 'absolute',
                right: 0,
                top: 0,
              }}
            >
              LIVE
            </span>
          </div>
        </div>
      );
    });
  };

  renderCreate() {
    if (this.props.isSignedIn) {
      return (
        <div style={{ textAlign: 'right' }}>
          <Link to="/streams/new" className="ui button primary">
            Create Stream
          </Link>
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        <h2>Streams</h2>
        <div className="ui celled list">{this.renderList()}</div>
        {this.renderCreate()}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    streams: Object.values(state.streams),
    currentUserId: state.auth.userId,
    isSignedIn: state.auth.isSignedIn
  };
};

export default connect(mapStateToProps, { fetchStreams })(StreamList);
