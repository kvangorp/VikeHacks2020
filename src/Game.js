import React from 'react';
import Swal from "sweetalert2";  
import Prompt from './Prompt';
import ResultVote from './ResultVote';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerName: this.props.playerName,
      prompting: false, // controls which view
      voting: false,
    };

    this.allPlayerNames = this.props.allPlayerNames;
    this.gameOver = false;
    this.counter = 0;
    this.allAnswers = {} // store playername: string
    this.pubnub = this.props.pubnub;
    this.gameChannel = this.props.gameChannel;
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
      if(msg.message.prompt){ 
        this.prompts++;
        if (this.prompts === this.playerCount) {
          this.setState({prompting: false});
          this.setState({voting: true});
        }
      } 
       /*else if (msg.message.vote) {
        this.votes++;
        if (this.votes === this.playerCount) {
          this.setState({voting: false});
          this.setState({prompting: true});

        }
      } */
      else if (msg.message.continue) {
        this.newRound();
      }});
  }

  newRound ()  {
    // iterate through all players and give them each a turn
    for (let playerName of this.allPlayerNames) {
      this.setState({voting: false});
      this.setState({prompting: true});
      this.setState({playerTurn: playerName});
    }
  } 

  
  checkForWinner = (squares) => {
    //this.announceWinner(squares[a]);
    //this.gameOver = true;
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
            this.state.prompting &&
            (<p>{status}
            <Prompt></Prompt></p>) 
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
