import Button from '@material-ui/core/Button';
import React from 'react';

class ResultVote extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        playerTurn: this.props.playerTurn,
        didVote: false,
        voting: this.props.voting
      };
  
    this.pubnub = this.props.pubnub;
    this.playerCount = this.props.playerCount;
    this.gameChannel = this.props.gameChannel;
    this.promptAnswers = ["raining cats and dogs","cloudy with a chance of meat balls","always sunny in philidalphia"];
    this.voteArray = this.props.voteArray;
  }

  clicked(index){
    this.setState({didVote: true});

    this.pubnub.publish({message: {
          vote: true,
          index: index
    }, channel: this.gameChannel
    });

  }


  render() {
    const butts = this.promptAnswers;

    const buttItems = butts.map((butt) =>
    <Button variant="contained" color= "primary"
        disabled = {this.state.didVote} key={butt} onClick={this.clicked.bind(this,butts.indexOf(butt))}>
      {butt}
    </Button>);

    //if (!this.state.voting) {
    //    buttItems[this.state.playerTurn] // go green!
    //}

    return (<div>
      <h3>Vote!</h3>
      {buttItems}  {this.state.didVote}
    </div>);
  }
}export default ResultVote
