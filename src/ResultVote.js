import Button from '@material-ui/core/Button';
import React from 'react';

class ResultVote extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        playerTurn: this.props.playerTurn,
        didVote: !this.props.voting, // voting over = disable button
        voting: this.props.voting
      };
  
    console.log("update voting", this.state.voting);
    this.pubnub = this.props.pubnub;
    this.playerCount = this.props.playerCount;
    this.gameChannel = this.props.gameChannel;
    this.promptAnswers = this.props.allAnswers; //["raining cats and dogs","cloudy with a chance of meat balls","always sunny in philidalphia"];
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


  clickContinue() {
    this.pubnub.publish({message: {
        continue: true,
  }, channel: this.gameChannel
  });

  }

  render() {
    const butts = Object.values(this.promptAnswers);
    const buttItems = butts.map((butt) =>
    <Button variant="contained" color= "primary"
        disabled = {this.state.didVote} key={butt} onClick={this.clicked.bind(this,butts.indexOf(butt))}>
      {butt}
    </Button>);

    let correctAnswer = ''

    if (!this.state.voting) {
        let domButtons = document.getElementsByClassName('MuiButtonBase-root');
        if (domButtons) {
            for (let i = 0; i < domButtons.length; i++) {
                domButtons[i].childNodes.forEach((child) => {
                    if (child.innerHTML === this.promptAnswers[this.state.playerTurn]) {
                        correctAnswer = "Correct answer: "+child.innerHTML;
                    }
                });
            }
        }
    }

    return (<div>
      <h3>Vote!</h3>
      {buttItems} 
      <p>{correctAnswer}</p>
      { !this.state.voting && <div><br/><Button variant="contained" color= "secondary"
        onClick={this.clickContinue.bind(this)}>Continue
    </Button></div>}

    </div>);
  }
}export default ResultVote
