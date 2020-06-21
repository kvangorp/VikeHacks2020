import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';



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
    this.allPrompts = ["what is your favourite building", "what is your favorite class", "what is your favorite ice cream", "why are you like this", "how much sleep do you get", "AAAA", "BBBB", "CCC", "DDD", "EEE"]
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

  handleChange(text) 
  {
    if (!text.target.value)
      return
    this.setState({answer: text.target.value});
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
        <TextField id="outlined-basic" label="Response" variant="outlined" onChange={this.handleChange}/>
        </form>
        <Button variant="contained" id="submit" disabled={this.state.disabled}
                    onClick={this.handleSubmit}
                    > Submit 
        </Button>
      </div>
    );
  }
}

// game will pass current player, list of players, and whos turn it is

export default Prompt;
