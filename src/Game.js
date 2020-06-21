import React from 'react';
import Prompt from './Prompt';
import ResultVote from './ResultVote';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerName: this.props.playerName,
      prompting: true, // controls which view
      voting: false,
      playerTurn: null
    };

    this.gameChannel = 'game--' + this.roomId;
    this.allPlayerNames = this.props.allPlayerNames;
    this.gameOver = false;
    this.counter = 0;
    this.allAnswers = {} // store playername: string
    this.pubnub = this.props.pubnub;
    this.gameChannel = this.props.gameChannel;
    this.votes = 0;
    this.prompts = 0;
    this.playerCount = this.allPlayerNames.length;
    this.turnIndex = 0;
  }

  componentDidMount(){
    this.pubnub.unsubscribeAll();
    this.pubnub.subscribe({
      channels: [this.gameChannel]
      });
    this.newRound();
  }


  componentDidUpdate() {
    this.pubnub.getMessage(this.gameChannel, (msg) => {
      // check for input

      //console.log(msg.message);

      if(msg.message.prompt) {
        this.prompts++;
        if (this.prompts >= this.playerCount) {
          this.setState({prompting: false});
          this.setState({voting: true});
        }
      }
      else if (msg.message.continue) {
        this.newRound();
      }});
  }

  newRound ()  {
    // iterate through all players and give them each a turn
    this.setState({playerTurn: this.allPlayerNames[this.turnIndex]});
    this.turnIndex++;
    this.setState({prompting: true});
    this.setState({voting: false});
    if (this.turnIndex == this.playerCount) {
      console.log("END GAME???");
    }
  }


  checkForWinner = (squares) => {
    //this.announceWinner(squares[a]);
    //this.newRound(null);
  };


  render() {
    let status = "STRING";
    // Change to current player's turn
    status = `${this.state.playerTurn === this.state.playerName? "Your turn" : "Not your turn"}`;

    return (
      <div className="game">
        <div className="turn-container">
          {
            this.state.prompting && <p>{status}</p>

          }
          {
            this.state.prompting &&
            <Prompt playerName={this.state.playerName} pubnub={this.pubnub} gameChannel={this.gameChannel}></Prompt>
          }

          { this.state.voting &&
            <ResultVote pubnub={this.pubnub} gameChannel={this.gameChannel}></ResultVote>
          }
        </div>
      </div>
    );
  }
}

export default Game;
