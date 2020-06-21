import Button from '@material-ui/core/Button';
import React from 'react';
import { green } from '@material-ui/core/colors';

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


  render() {
    const butts = Object.values(this.promptAnswers);

    const buttItems = butts.map((butt) =>
    <Button variant="contained" color= "primary"
        disabled = {this.state.didVote} key={butt} onClick={this.clicked.bind(this,butts.indexOf(butt))}>
      {butt}
    </Button>);

    if (!this.state.voting) {
        let domButtons = document.getElementsByClassName('MuiButtonBase-root');
        if (domButtons) {
            for (let i = 0; i < domButtons.length; i++) {
                // console.log(this.promptAnswers[this.state.playerTurn]);
                console.log(domButtons[i].childNodes);
                domButtons[i].childNodes.forEach((child) => {
                    if (child.innerHTML === this.promptAnswers[this.state.playerTurn]) {
                        if (domButtons[i].style) {
                            domButtons[i].style.backgroundColor = "#00e600"
                            return;
                        }
                    }
                });
            }
        }
    }

    return (<div>
      <h3>Vote!</h3>
      {buttItems}  {this.state.didVote}
    </div>);
  }
}export default ResultVote
