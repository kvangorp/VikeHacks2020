import React, { Component } from "react";
import Game from "./Game";
import PubNubReact from "pubnub-react";
import Swal from "sweetalert2";
import shortid from "shortid";
import "./Game.css";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";

class App extends Component {
  constructor(props) {
    super(props);
    this.pubnub = new PubNubReact({
      publishKey: "pub-c-c9377952-9ac2-4c85-9d37-c670ea401a9b",
      subscribeKey: "sub-c-10784c98-b316-11ea-afa6-debb908608d9",
      openHelp: false,
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
    this.maxPlayers = 2;

    this.handleOpenHelp = this.handleOpenHelp.bind(this);
    this.handleCloseHelp = this.handleCloseHelp.bind(this);
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
          this.setState({
            allPlayerNames: newPlayernames,
          });
        }

        // Start the game once enought players have joined
        if (
          this.state.allPlayerNames &&
          this.state.allPlayerNames.length === this.maxPlayers
        ) {
          // enough players

          this.pubnub.publish({
            message: {
              allPlayerNames: this.state.allPlayerNames,
              isPlaying: true,
            },
            channel: this.lobbyChannel,
          });
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
      console.log("INPUT: ", input);
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

  reset() {
    this.setState({
      playerName: "", // set in modal
      playerId: null, // tba
      isPlaying: false,
      inRoom: false,
      isRoomCreator: false,
      isDisabled: false, // the Create button
      allPlayerNames: [],
    });
    this.pubnub.unsubscribeAll();
    this.lobbyChannel = null;
    this.roomId = null;
    this.pubnub.init(this);
    this.maxPlayers = 2;
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
          0 < response.totalOccupancy &&
          response.totalOccupancy < this.maxPlayers
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

  handleOpenHelp() {
    this.setState({ openHelp: true });
  }

  handleCloseHelp() {
    this.setState({ openHelp: false });
  }

  render() {
    // JUST render the login screen + waiting screen
    return (
      <html>
        <head>
          <title>UVic game</title>
        </head>
        <body>
          <div class="heading">
            <div className="Help">
              <Button
                id="help"
                variant="outlined"
                color="primary"
                onClick={this.handleOpenHelp}
              >
                Help
              </Button>
              <Dialog
                id="dialog"
                open={this.state.openHelp}
                onClose={this.handleCloseHelp}
              >
                <h1>Rules:</h1>
                <ul>
                  <li>
                    To start, one person is it, let's say her name is Lucy
                  </li>
                  <li>Everyone gets a prompt</li>
                  <li>Answer the prompt as if you were Lucy</li>
                  <li>
                    Once everyone has answered, you'll see everyone's answers
                  </li>
                  <li>Click on the one you think is Lucy's</li>
                  <li>You'll see which one was right</li>
                  <li>Then it's the next person's turn!</li>
                </ul>
              </Dialog>
            </div>
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
