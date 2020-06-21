
import React from 'react';

class ResultVote extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        playerTurn: this.props.playerTurn,
        didVote: false
      };
  
    this.pubnub = this.props.pubnub;
    this.playerCount = this.props.playerCount;
    this.gameChannel = this.props.gameChannel;
    this.promptAnswers = ["raining cats and dogs","cloudy with a chance of meat balls","always sunny in philidalphia"];
    this.votes = new Array(this.promptAnswers.length).fill(0);
    this.voting = true;
    this.results = false;
    this.voteCount = 0;
  }

  clicked(index){
    this.setState({didVote: true});

    this.pubnub.publish({message: {
          vote: true,
          index: index
    }, channel: this.gameChannel
    });

  }

  componentDidUpdate() {
    this.pubnub.getMessage(this.gameChannel, (msg) => {
        console.log("BECCA WTF");
      if (msg.message.vote.value && msg.message.index.value !== null) {
        this.voteCount++;
        this.votes[msg.message.index.value]++;
        console.log(this.voteCount);
        console.log(this.votes);
      }
      if (this.voteCount === this.playerCount) {
        this.setState({voting: false});
        this.setState({results: true});
      }
    });
  }

  render() {
    const butts = this.promptAnswers;
    const buttItems = butts.map((butt) =>
    <button disabled = {this.state.didVote} key={butt} onClick={this.clicked.bind(this,butts.indexOf(butt))}>
      {butt}
    </button>);

    return (<div>
      <h3>Vote!</h3>
      {buttItems}  {this.state.didVote}
    </div>);
  }
}export default ResultVote
