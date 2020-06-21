import React, { Component } from 'react';
import Game from './Game';
import PubNubReact from 'pubnub-react';
import Swal from "sweetalert2";  
import shortid  from 'shortid';
import './Game.css';
import Button from '@material-ui/core/Button';
 
class App extends Component {
  constructor(props) {  
    super(props);
    this.pubnub = new PubNubReact({
      publishKey: "pub-c-aa028895-a93c-4692-88ab-38bd83c46fbf", 
      subscribeKey: "sub-c-20f9cc86-b316-11ea-875a-ceb74ea8e96a"    
    });
    
    this.state = {
      playerName: '', // set in modal
      playerId: null, // tba
      isPlaying: false,
      isRoomCreator: false,
      isDisabled: false, // the Create button
      allPlayerNames: []
    };

    this.lobbyChannel = null;
    this.roomId = null;    
    this.pubnub.init(this);
    this.maxPlayers = 2;
  }  
  
  componentWillUnmount() {
    this.pubnub.unsubscribe({
      channels : [this.lobbyChannel]
    });
  }
  
  componentDidUpdate() {
    // Check that the player is connected to a channel
    if(this.lobbyChannel != null) {
      this.pubnub.getMessage(this.lobbyChannel, (msg) => {

        if(this.state.isRoomCreator && msg.message.playerName){
            //this.state.allPlayerNames.push(msg.message.playerName);
            var newPlayernames = this.state.allPlayerNames.concat(msg.message.playerName);
            this.setState({
              allPlayerNames: newPlayernames
            });
          }

        // Start the game once enought players have joined
        if(this.state.allPlayerNames && this.state.allPlayerNames.length === this.maxPlayers){ // enough players

          this.pubnub.publish({message: {
            allPlayerNames: this.state.allPlayerNames,
            isPlaying: true
          },
          channel: this.lobbyChannel});
        }

        if (msg.message.isPlaying) {
          this.setState({
            isPlaying: true,
            allPlayerNames: msg.message.allPlayerNames
          });         
        } 
      });
    }
  }

  nameModal = {
    font: 'Roboto',
    position: 'top',
    allowOutsideClick: false,
    title: 'Enter your name',
    input: 'text',
    confirmButtonText: 'Enter',
    preConfirm: (str) => {
      if (!Boolean(str))
        return false;       // check that input string has value
      this.setState({playerName: str})
      this.setState({inRoom: true})

      // pubnub publish new name...
      this.pubnub.publish({
        message: {
          playerName: str,
        },
        channel: this.lobbyChannel
      }, function(status,response) {
        console.log("Status, Result: ", status, response)
      });      
    }
  };


  // Create a room channel
  onPressCreate = (e) => {
    // Create a random name for the channel
    this.roomId = shortid.generate().substring(0,5);
    this.lobbyChannel = 'tictactoelobby--' + this.roomId;

    this.pubnub.subscribe({
      channels: [this.lobbyChannel],
      withPresence: true
    });

    Swal.fire(this.nameModal);
    this.setState({isRoomCreator: true });   
  }

  joinRoomModal = {
    font: 'Roboto',
    position: 'top',
    input: 'text',
    allowOutsideClick: false,
    inputPlaceholder: 'Enter the room id',
    showCancelButton: true,
    confirmButtonColor: 'rgb(208,33,41)',
    confirmButtonText: 'OK',
    width: 275,
    padding: '0.7em',
    customClass: {
      heightAuto: false,
      popup: 'popup-class',
      confirmButton: 'join-button-class ',
      cancelButton: 'join-button-class'
    },
    preConfirm: (input) => {
      console.log("INPUT: ",input);
      // Check if the user typed a value in the input field
      if(input){
        this.joinRoom(input);
      }
    }
  };
  
  // The 'Join' button was pressed
  onPressJoin = (e) => {
    var modals = [];
    modals.push(this.joinRoomModal);
    modals.push(this.nameModal);
    Swal.queue(modals);;
  }

  // Join a room channel
  joinRoom = (value) => {
    this.roomId = value;
    this.lobbyChannel = 'tictactoelobby--' + this.roomId;
    this.setState({inRoom: true});

    // Check the number of people in the channel
    this.pubnub.hereNow({
      channels: [this.lobbyChannel], 
    }).then((response) => { 
        if(response.totalOccupancy < this.maxPlayers){ 
          this.pubnub.subscribe({
            channels: [this.lobbyChannel],
            withPresence: true
          });
        } 
        else{
          // Game in progress
          Swal.fire({
            position: 'top',
            allowOutsideClick: false,
            title: 'Error',
            text: 'Could not enter room',
            width: 275,
            padding: '0.7em',
            customClass: {
                heightAuto: false,
                title: 'title-class',
                popup: 'popup-class',
                confirmButton: 'button-class'
            }
          })
        }
    }).catch((error) => { 
      console.log(error);
    });
  }

  
  render() {  // JUST render the login screen + waiting screen 
    return (  
        <div className="page"> 
          <div className="title">
            <p>VikeHacks Game</p>
          </div>

          {
            !this.state.inRoom &&
            <div className="loginScreen">
                <div className="button-container">
                  <Button variant="contained" color= "primary" 
                    onClick={(e) => this.onPressCreate()}
                    > Create 
                  </Button>
                  <Button variant="contained" color= "primary"
                    onClick={(e) => this.onPressJoin()}
                    > Join 
                  </Button>
                </div>                        
              </div>
          }

          {
            (!this.state.isPlaying && this.state.inRoom) && 
            <p>Waiting for players... <br/><br/>Your Room Id: {this.roomId} </p>
          }

          {
            this.state.isPlaying &&
             <Game 
              pubnub={this.pubnub}
              gameChannel={'game--' + this.roomId} 
              playerName={this.state.playerName}
              allPlayerNames={this.state.allPlayerNames}
              isRoomCreator={this.state.isRoomCreator}
              endGame={this.endGame}
            /> 
          }
        </div>
    );  
  } 
}

export default App;
