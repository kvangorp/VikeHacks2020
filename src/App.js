import React, { Component } from 'react';
import Game from './Game';
import Prompt from './Prompt';
import PubNubReact from 'pubnub-react';
import Swal from "sweetalert2";  
import shortid  from 'shortid';
import './Game.css';
 
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
      myTurn: false, 
      allPlayerNames: []
    };

    this.lobbyChannel = null;
    this.gameChannel = null;
    this.roomId = null;    
    this.pubnub.init(this);
    this.maxPlayers = 3;
  }  
  
  componentWillUnmount() {
    this.pubnub.unsubscribe({
      channels : [this.lobbyChannel, this.gameChannel]
    });
  }
  
  componentDidUpdate() {
    // Check that the player is connected to a channel
    if(this.lobbyChannel != null){
      this.pubnub.getMessage(this.lobbyChannel, (msg) => {
          // Add playernames
          if(msg.message.playerName){
            //this.state.allPlayerNames.push(msg.message.playerName);
            var newPlayernames = this.state.allPlayerNames.concat(msg.message.playerName);
            this.setState({
              allPlayerNames: newPlayernames
            });
          }

        // Start the game once an opponent joins the channel
        if(this.state.allPlayerNames && this.state.allPlayerNames.length == this.maxPlayers){ // enough players
          // Create a different channel for the game
          this.gameChannel = 'game--' + this.roomId;

          this.pubnub.subscribe({
            channels: [this.gameChannel]
          });

          this.setState({
            isPlaying: true // SEND PUBSUB
          });  
          

          // Close the modals if they are opened
          Swal.close();
        }
      }); 
    }
  }

  nameModal = {
    position: 'top',
    allowOutsideClick: false,
    title: 'Enter your name',
    input: 'text',
    confirmButtonText: 'Enter',
    preConfirm: (str) => {
      if (!Boolean(str))
        return false;       // check that input string has value
      this.setState({playerName: str})
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

  // Chain modals
  var modals = [];
  modals.push(this.nameModal);
  modals.push({position: 'top', allowOutsideClick: false, title: 'Share this room ID with your friend',
    text: this.roomId, width: 275, padding: '0.7em',
    // Custom CSS
    customClass: {
        heightAuto: false,
        title: 'title-class',
        popup: 'popup-class',
        confirmButton: 'button-class'
    }});
    Swal.queue(modals);
    this.setState({
      isRoomCreator: true,
      isDisabled: true, // Disable the 'Create' button
      myTurn: true, // Room creator makes the 1st move
    });   
  }

  joinRoomModal = {
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

    // Check the number of people in the channel
    this.pubnub.hereNow({
      channels: [this.lobbyChannel], 
    }).then((response) => { 
        if(response.totalOccupancy < this.maxPlayers){ 
          this.pubnub.subscribe({
            channels: [this.lobbyChannel],
            withPresence: true
          });
          
          Swal.fire(this.nameModal); // enter name, start game when enough names
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

  // Reset everything
  endGame = () => {
    this.setState({
      name: '',
      isPlaying: false,
      isRoomCreator: false,
      isDisabled: false,
      myTurn: false,
    });

    this.lobbyChannel = null;
    this.gameChannel = null;
    this.roomId = null;  

    this.pubnub.unsubscribe({
      channels : [this.lobbyChannel, this.gameChannel]
    });
  }
  
  render() {  // JUST render the login screen + waiting screen 
    return (  
        <div> 
          <div className="title">
            <p>VikeHacks Game</p>
          </div>
          <text>PlayerNames: {this.state.allPlayerNames}</text>


          {
            !this.state.isPlaying &&
            <div className="loginScreen">
                <div className="button-container">
                  <button 
                    className="create-button "
                    disabled={this.state.isDisabled}
                    onClick={(e) => this.onPressCreate()}
                    > Create 
                  </button>
                  <button 
                    className="join-button"
                    onClick={(e) => this.onPressJoin()}
                    > Join 
                  </button>
                </div>                        
              </div>
          }

          {
            this.state.isPlaying &&
            <text>READY TO PLAY: {this.state.allPlayerNames.items}</text>
            /*<Game 
              pubnub={this.pubnub}
              gameChannel={this.gameChannel} 
              playerName={this.state.playerName}
              allPlayerNames={this.state.allPlayerNames}
              isRoomCreator={this.state.isRoomCreator}
              endGame={this.endGame}
            /> */
          }
        </div>
    );  
  } 
}

export default App;
