
import React from 'react';

class ResultVote extends React.Component {

  constructor(props) {
    super(props);
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
    this.votes[index] +=1;
    console.log(this.votes);

    this.pubnub.publish({message: {
          vote: true
    },
          channel: this.gameChannel
    },function(status,response) {
        console.log("Status, Result: ", status, response)
      });
  }

  componentDidUpdate() {
    this.pubnub.getMessage(this.gameChannel, (msg) => {
      if (msg.message.vote) {
        this.voteCount++;
        console.log(this.voteCount);
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
    <button key={butt} onClick={this.clicked.bind(this,butts.indexOf(butt))}>
      {butt}
    </button>);

    return (<div>
      <h3>Vote!</h3>
      {buttItems}
    </div>);
  }
}export default ResultVote
