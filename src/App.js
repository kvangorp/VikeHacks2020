import React, { Component } from "react";
import Game from "./Game";
import PubNubReact from "pubnub-react";
import Swal from "sweetalert2";
import shortid from "shortid";
import "./Game.css";
import Button from "@material-ui/core/Button";

class App extends Component {
  
  constructor(props) {
    super(props);
    this.pubnub = new PubNubReact({
      publishKey: "pub-c-c9377952-9ac2-4c85-9d37-c670ea401a9b",
      subscribeKey: "sub-c-10784c98-b316-11ea-afa6-debb908608d9",
    });

    this.state = {
      playerName: "", // set in modal
      playerId: null, // tba
      isPlaying: false,
      inRoom: false,
      isRoomCreator: false,
      isDisabled: false, // the Create button
      allPlayerNames: [],
    };

    this.lobbyChannel = null;
    this.roomId = null;
    this.pubnub.init(this);
  }

  componentWillUnmount() {
    this.pubnub.unsubscribe({
      channels: [this.lobbyChannel],
    });
  }

  componentDidUpdate() {
    // Check that the player is connected to a channel
    if (this.lobbyChannel != null) {
      this.pubnub.getMessage(this.lobbyChannel, (msg) => {
        if (this.state.isRoomCreator && msg.message.playerName) {
          //this.state.allPlayerNames.push(msg.message.playerName);
          var newPlayernames = this.state.allPlayerNames.concat(
            msg.message.playerName
          );
          this.setState({allPlayerNames: newPlayernames});
        }

        if (msg.message.isPlaying) {
          this.setState({
            isPlaying: true,
            allPlayerNames: msg.message.allPlayerNames,
          });
        }

      });
    }
  }

  nameModal = {
    font: "Roboto",
    position: "top",
    allowOutsideClick: false,
    title: "Enter your name",
    input: "text",
    confirmButtonText: "Enter",
    preConfirm: (str) => {
      if (!Boolean(str)) return false; // check that input string has value
      this.setState({ playerName: str });
      this.setState({ inRoom: true });

      // pubnub publish new name...
      this.pubnub.publish(
        {
          message: {
            playerName: str,
          },
          channel: this.lobbyChannel,
        },
        function (status, response) {
          console.log("Status, Result: ", status, response);
        }
      );
    },
  };

  // Create a room channel
  onPressCreate = (e) => {
    // Create a random name for the channel
    this.roomId = shortid.generate().substring(0, 5);
    this.lobbyChannel = "tictactoelobby--" + this.roomId;

    this.pubnub.subscribe({
      channels: [this.lobbyChannel],
      withPresence: true,
    });

    Swal.fire(this.nameModal);
    this.setState({ isRoomCreator: true });
  };

  joinRoomModal = {
    font: "Roboto",
    position: "top",
    input: "text",
    allowOutsideClick: false,
    inputPlaceholder: "Enter the room id",
    showCancelButton: true,
    confirmButtonColor: "rgb(208,33,41)",
    confirmButtonText: "OK",
    width: 275,
    padding: "0.7em",
    customClass: {
      heightAuto: false,
      popup: "popup-class",
      confirmButton: "join-button-class ",
      cancelButton: "join-button-class",
    },
    preConfirm: (input) => {
      // Check if the user typed a value in the input field
      if (input) {
        this.joinRoom(input);
      }
    },
  };

  // The 'Join' button was pressed
  onPressJoin = (e) => {
    var modals = [];
    modals.push(this.joinRoomModal);
    modals.push(this.nameModal);
    Swal.queue(modals);
  };

  // The 'Start' button was pressed
  onPressStart = (e) => {
    this.pubnub.publish({
      message: {
        allPlayerNames: this.state.allPlayerNames,
        isPlaying: true,
      },
      channel: this.lobbyChannel,
    });
  }

  reset() {
    this.setState({
      playerName: "", // set in modal
      playerId: null, // tba
      isPlaying: false,
      inRoom: false,
      isRoomCreator: false,
      isDisabled: false, // the Create button
      allPlayerNames: [],
      maxPlayers: 20
    });
    this.pubnub.unsubscribeAll();
    this.lobbyChannel = null;
    this.roomId = null;
    this.pubnub.init(this);
  }

  // Join a room channel
  joinRoom = (value) => {
    this.roomId = value;
    this.lobbyChannel = "tictactoelobby--" + this.roomId;
    this.setState({ inRoom: true });

    // Check the number of people in the channel
    this.pubnub
      .hereNow({
        channels: [this.lobbyChannel],
      })
      .then((response) => {
        if (
          0 < response.totalOccupancy
        ) {
          this.pubnub.subscribe({
            channels: [this.lobbyChannel],
            withPresence: true,
          });
        } else {
          // Game in progress or invalid code
          Swal.close();
          Swal.fire({
            position: "top",
            allowOutsideClick: false,
            title: "Error",
            text: "Could not enter room",
            width: 275,
            padding: "0.7em",
            customClass: {
              heightAuto: false,
              title: "title-class",
              popup: "popup-class",
              confirmButton: "button-class",
            },
          });
          this.reset();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleOpenRules() {
    Swal.fire({
      font: "Roboto",
      position: "top",
      title: "Rules",
      html:
        "To start, one person is it, let's say her name is Lucy." +
        "Everyone gets a prompt.                                  " +
        "Answer the prompt as if you were Lucy.                    " +
        "Once everyone has answered, you'll see everyone's answers." +
        "Click on the one you think is Lucy's.                      " +
        "You'll see which one was right.                            " +
        "Then it's the next person's turn!                          ",
      showCloseButton: true,
      showConfirmButton: false,      
    });
  }

  render() {
    return (
      <html>
        <head>
          <title>UVic game</title>
        </head>
        <body>
          <div class="heading">
            <Button
              id="rules-button"
              variant="outlined"
              color="primary"
              onClick={this.handleOpenRules}
            >
              Rules
            </Button>
            <h1>The UVic game!</h1>
          </div>
          {!this.state.inRoom && (
            <div className="loginScreen">
              <div className="button-container">
                <Button
                  id="create"
                  variant="contained"
                  onClick={(e) => this.onPressCreate()}
                >
                  {" "}
                  Create a new game
                </Button>
                <Button
                  id="join"
                  variant="contained"
                  onClick={(e) => this.onPressJoin()}
                >
                  {" "}
                  Join a game
                </Button>
              </div>
            </div>
          )}

          {!this.state.isPlaying && this.state.inRoom && (
            <div>
              <p>
                Your Room Id: <span id="meetingID">{this.roomId}</span>
              </p>
              <p>
                Waiting for players... <br />
                <br />
              </p>
              {this.state.isRoomCreator &&(
              <Button
                id="start"
                variant="contained"
                onClick={(e) => this.onPressStart()}>
                Start Game
              </Button>)}
              {this.state.isRoomCreator &&(
                <p>Players: {this.state.allPlayerNames.length}</p>
              )}
            </div>
          )}

          {this.state.isPlaying && (
            <Game
              pubnub={this.pubnub}
              gameChannel={"game--" + this.roomId}
              playerName={this.state.playerName}
              allPlayerNames={this.state.allPlayerNames}
              isRoomCreator={this.state.isRoomCreator}
              endGame={this.endGame}
            />
          )}
        </body>
      </html>
    );
  }
}

export default App;
