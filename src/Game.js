import React from 'react';
import Swal from "sweetalert2";  
import Prompt from './Prompt';
import ResultVote from './ResultVote';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerName: this.props.playerName,
      myTurn: this.props.myTurn
    };

    this.allPlayerNames = this.props.allPlayerNames
    this.gameOver = false;
    this.counter = 0;
  }

  componentDidMount(){
    this.props.pubnub.getMessage(this.props.gameChannel, (msg) => {
      // Publish move to the opponent's board
      if(msg.message.turn === this.props.piece){
        this.publishMove(msg.message.index, msg.message.piece);
      }

      // Start a new round
      else if(msg.message.reset){
        this.setState({
          squares: Array(9).fill(''),
          whosTurn : this.props.myTurn
        });

        this.turn = 'X';
        this.gameOver = false;
        this.counter = 0;
        Swal.close()
      }

      // End the game and go back to the lobby
      else if(msg.message.endGame){
        Swal.close();
        this.props.endGame();
      }
    });
  }

  newRound ()  {
    // iterate through all players and give them each a turn
    for (let playerName in this.allPlayerNames) {

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
    status = `${this.state.myTurn ? "Your turn" : "Opponent's turn"}`;

    return (
      <div className="game">
        
        <div className="turn-container">
        </div>   
      </div>
    );
  }
}

export default Game;
