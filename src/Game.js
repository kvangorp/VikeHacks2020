import React from 'react';
import Swal from "sweetalert2";  
import Prompt from './Prompt';
import ResultVote from './ResultVote';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerName: this.props.playerName,
      myTurn: this.props.myTurn,
      prompting: false, // controls which view
      voting: false,
    };

    this.allPlayerNames = this.props.allPlayerNames;
    this.gameOver = false;
    this.counter = 0;
    this.allAnswers = {} // store playername: string
    this.pubnub = this.props.pubnub;
    this.gameChannel = gameChannel;
    this.votes = 0;
    this.prompts = 0;
    this.playerCount = this.allPlayerNames.length;
  }

  componentDidMount(){
    this.newRound();
  }


  componentDidUpdate() {
    this.pubnub.getMessage(this.gameChannel, (msg) => {
      // check for votes
      if(msg.message.prompt){ //TODO: does this work
        this.prompts++;
      } 
      else if (msg.message.vote) {
        this.votes++;
      } else if (msg.message.continue) {
        this.newRound();
      }});
  }

  newRound ()  {
    // iterate through all players and give them each a turn
    for (let playerName in this.allPlayerNames) {
      this.setState({prompting: true});
      if (playerName === this.state.playerName)
        this.setState({myTurn: true});
      // wait for pubnubs from Prompt

      this.setState({voting: true});
      // wait for pubnub "continue" message from Voting

    }
  } 

  
  checkForWinner = (squares) => {
    //this.announceWinner(squares[a]);
    //this.gameOver = true;
    //this.newRound(null);
  };
   

  render() {
    let status;
    // Change to current player's turn
    status = `${this.state.myTurn ? "Your turn" : ""}`;

    return (
      <div className="game">
        <div className="turn-container">
          {
            this.state.prompting &&
            <Prompt></Prompt>
          }

          { this.state.voting && 
          
          <ResultVote></ResultVote>
          }  
        </div>   
      </div>
    );
  }
}

export default Game;
