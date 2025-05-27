import React from 'react';
import { connect } from 'react-redux';
import flv from 'flv.js';

import { fetchStream } from '../../actions';

class StreamShow extends React.Component {
  constructor(props) {
    super(props);

    this.videoRef = React.createRef();
    // Quiz state
    this.state = {
      currentQuestion: 0,
      selectedOption: null,
      timer: 15,
    };
    this.quizQuestions = [
      {
        question: 'What is the capital of France?',
        options: ['Paris', 'London', 'Berlin', 'Madrid'],
        answer: 'Paris',
      },
      {
        question: 'Which planet is known as the Red Planet?',
        options: ['Earth', 'Mars', 'Jupiter', 'Saturn'],
        answer: 'Mars',
      },
      {
        question: 'Who wrote Hamlet?',
        options: ['Shakespeare', 'Dickens', 'Tolstoy', 'Hemingway'],
        answer: 'Shakespeare',
      },
    ];
    this.timerInterval = null;
  }

  componentDidMount() {
    const { id } = this.props.match.params;

    this.props.fetchStream(id);
    this.buildPlayer();
    this.startTimer();
  }

  componentDidUpdate(prevProps, prevState) {
    this.buildPlayer();
    // Reset timer and selected option when question changes
    if (prevState.currentQuestion !== this.state.currentQuestion) {
      this.setState({ timer: 15, selectedOption: null });
    }
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.destroy();
    }
    clearInterval(this.timerInterval);
  }

  startTimer = () => {
    this.timerInterval = setInterval(() => {
      this.setState(prevState => {
        if (prevState.timer === 1) {
          // Move to next question or loop
          return {
            currentQuestion: (prevState.currentQuestion + 1) % this.quizQuestions.length,
            timer: 15,
            selectedOption: null,
          };
        }
        return { timer: prevState.timer - 1 };
      });
    }, 1000);
  };

  handleOptionClick = (option) => {
    this.setState({ selectedOption: option });
  };

  buildPlayer() {
    if (this.player || !this.props.stream) {
      return;
    }

    const { id, streamKey } = this.props.stream;
    const httpUrl = process.env.REACT_APP_HTTP_URL || 'http://localhost:8000/live';
    
    this.player = flv.createPlayer({
      type: 'flv',
      url: `${httpUrl}/${streamKey}.flv`
    });
    this.player.attachMediaElement(this.videoRef.current);
    this.player.load();
  }

  renderStreamInfo() {
    if (!this.props.stream) {
      return null;
    }

    const { title, description, streamKey } = this.props.stream;
    const isOwner = this.props.currentUserId === this.props.stream.userId;
    const rtmpUrl = process.env.REACT_APP_RTMP_URL || 'rtmp://localhost/live';

    return (
      <div className="ui segment">
        <h3>{title}</h3>
        <p>{description}</p>
        {isOwner && (
          <div className="ui segment">
            <h4>Stream Setup</h4>
            <div className="ui info message">
              <div className="header">OBS Configuration</div>
              <p>Use these settings in OBS:</p>
              <div className="ui list">
                <div className="item">
                  <i className="server icon"></i>
                  <div className="content">
                    <div className="header">Server</div>
                    <div className="description">
                      <div className="ui action input">
                        <input 
                          type="text" 
                          value={rtmpUrl} 
                          readOnly 
                          style={{ fontFamily: 'monospace' }}
                        />
                        <button 
                          className="ui button"
                          onClick={() => {
                            navigator.clipboard.writeText(rtmpUrl);
                          }}
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <i className="key icon"></i>
                  <div className="content">
                    <div className="header">Stream Key</div>
                    <div className="description">
                      <div className="ui action input">
                        <input 
                          type="text" 
                          value={streamKey} 
                          readOnly 
                          style={{ fontFamily: 'monospace' }}
                        />
                        <button 
                          className="ui button"
                          onClick={() => {
                            navigator.clipboard.writeText(streamKey);
                          }}
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="ui warning message">
                <div className="header">Important</div>
                <p>Make sure to:</p>
                <ol>
                  <li>Copy the Server URL exactly as shown</li>
                  <li>Copy the Stream Key exactly as shown</li>
                  <li>In OBS, go to Settings → Stream</li>
                  <li>Select "Custom" as the service</li>
                  <li>Paste the Server URL in the "Server" field</li>
                  <li>Paste the Stream Key in the "Stream Key" field</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  render() {
    if (!this.props.stream) {
      return <div>Loading...</div>;
    }

    const { title, description } = this.props.stream;

    return (
      <div
        style={{
          background: 'radial-gradient(circle at 50% 0%, #23244a 70%, #0a0a23 100%)',
          minHeight: '100vh',
          padding: '0',
        }}
      >
        <video
          ref={this.videoRef}
          style={{
            width: '100%',
            maxWidth: '600px',      // or any max width you want
            height: '500px',         // let height adjust automatically
            // maxHeight: '340px',     // or any max height you want
            objectFit: 'contain',
            display: 'block',
            margin: '0 auto'
          }}
          autoPlay
          playsInline
        />
        {/* <h1>{title}</h1>
        <h5>{description}</h5> */}
        {this.renderStreamInfo()}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return { 
    stream: state.streams[ownProps.match.params.id],
    currentUserId: state.auth.userId
  };
};

export default connect(mapStateToProps, { fetchStream })(StreamShow);
