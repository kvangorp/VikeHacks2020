import React from 'react';
import Button from '@material-ui/core/Button';


class Prompt extends React.Component 
{
  constructor(props) {
    super(props);
    this.state = {
      playerName: this.props.playerName,
      answer: "",
      prompt: "",
      disabled: false
    };
    this.allPrompts = ["what is your favoirite building", "what is your favorite class"]
    this.pubnub = this.props.pubnub
    this.gameChannel = this.props.gameChannel
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.promptIndex = this.props.promptIndex;
    console.log("prompt index", this.promptIndex);
  }

  componentDidMount()
  {
    console.log(this.allPrompts[this.promptIndex])
    this.setState({prompt:this.allPrompts[this.promptIndex]})
  }

  handleChange(event) 
  {
    this.setState({answer: event.target.value});
  }

  handleSubmit()
  {
    this.setState({disabled: true});
    this.pubnub.publish({message: {
      answer: this.state.answer,
      playerName: this.state.playerName,
      prompt: true,
    },
    channel: this.gameChannel},
    function(status) {
      console.log(status);
    });
  }

  render() 
  {
    return (
      <div>
        <p>{this.state.prompt}</p>
        <form>
          <input type="text" onChange={this.handleChange}></input>
        </form>
        <Button variant="contained" color= "primary" disabled={this.state.disabled}
                    onClick={this.handleSubmit}
                    > Submit 
        </Button>
      </div>
    );
  }
}

// game will pass current player, list of players, and whos turn it is

export default Prompt;
