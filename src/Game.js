import React from 'react';
import Prompt from './Prompt';
import ResultVote from './ResultVote';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerName: this.props.playerName,
      prompting: true, // controls which view
      voting: true,
      playerTurn: null
    };

    this.playerName = this.props.playerName;
    this.gameChannel = 'game--' + this.roomId;
    this.allPlayerNames = this.props.allPlayerNames;
    this.gameOver = false;
    this.counter = 0;
    this.allAnswers = {}; // store playername: string
    this.pubnub = this.props.pubnub;
    this.gameChannel = this.props.gameChannel;
    this.voteArray = new Array(10).fill(0);
    this.voteCount = 0;
    this.prompts = 0;
    this.playerCount = this.allPlayerNames.length;
    this.turnIndex = 0;
    this.promptIndex = 0;
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

      if(msg.message.prompt) {
        this.prompts++;
        console.log("prompts", this.prompts);
        this.allAnswers[msg.message.playerName] = msg.message.answer;
        if (this.prompts >= this.playerCount) {
          this.setState({prompting: false});
          this.setState({voting: true});
        }
      }
      else if (msg.message.vote) {
        this.updateVote(msg);
      }
      else if (msg.message.continue) {
        this.newRound();
      }});
  }

  newRound ()  {
    // iterate through all players and give them each a turn
    this.setState({playerTurn: this.allPlayerNames[this.turnIndex]});
    this.promptIndex++;
    this.prompts = 0;
    this.voteCount = 0;
    if (this.promptIndex > 9)
      this.promptIndex-=9;
    this.turnIndex++;
    this.setState({prompting: true});
    console.log("update voting", this.state.voting);

    if (this.turnIndex === this.playerCount) {
      // console.log("END GAME???");
    }
  }


  updateVote(msg) {
    if (msg.message.vote) {
      this.voteCount++;
      this.voteArray[msg.message.index]++;
      console.log(this.voteCount);
    }
    if (this.voteCount -1 === this.playerCount) {
      console.log("set voting false");
      this.setState({voting: false});
      // hardcoded continue!
     // this.newRound();    
    }
  }


  render() {
    let status = this.state.playerTurn?.localeCompare(this.playerName) ? `It's ${this.state.playerTurn}'s turn!` : 'Your turn';
    let waitString = 'Waiting for players to vote...';
    return (
      <div className="game">
        <div className="nameHeader">
          {this.playerName}
          </div>
        <div className="turn-container">
          {
            this.state.prompting && <p>{status}</p>
          }
          { // input prompts
            this.state.prompting &&
            <Prompt playerTurn = {this.state.playerTurn} promptIndex = {this.promptIndex} playerName={this.state.playerName} pubnub={this.pubnub} gameChannel={this.gameChannel}></Prompt>
          }

          { // wait for players to vote
          (!this.state.prompting && this.state.voting && this.state.playerTurn === this.playerName) && 
            <p>{waitString}</p>
          }

          { // vote for prompts
           (!this.state.prompting && this.state.voting && this.state.playerTurn !== this.playerName) && 
            <ResultVote allAnswers = {this.allAnswers} voteArray = {this.voteArray} voting = {this.state.voting} playerTurn = {this.state.playerTurn} pubnub={this.pubnub} gameChannel={this.gameChannel}></ResultVote>
          }

          { // view results
            (!this.state.prompting && !this.state.voting) && 
            <ResultVote allAnswers = {this.allAnswers} voteArray = {this.voteArray} voting = {this.state.voting} playerTurn = {this.state.playerTurn} pubnub={this.pubnub} gameChannel={this.gameChannel}></ResultVote>
          }
        </div>
      </div>
    );
  }
}

export default Game;
