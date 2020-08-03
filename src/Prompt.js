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
      disabled: false,
      submitted: false,
    };
    this.allPrompts = ["What is the best building on campus?", "Which professor do you disagree with the most?", "What class made you cry the most?", "What do you do during long breaks on campus?", "What should you never say to a professor?", "What was your most embarrassing moment on campus?", "What class did you get the worst grade in?", "Who's class would you like to TA?", "What's your go-to parking spot?", "What place on campus is a rip-off?",]
    this.pubnub = this.props.pubnub
    this.gameChannel = this.props.gameChannel
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.promptIndex = this.props.promptIndex;
  }

  componentDidMount()
  {
    this.setState({prompt:this.allPrompts[this.promptIndex]})
  }

  handleChange(text) 
  {
    if (!text.target.value)
      return
    this.setState({answer: text.target.value});
  }

  handleSubmit(e)
  {
    e.preventDefault();
    this.setState({disabled: true});
    this.pubnub.publish({message: {
      answer: this.state.answer,
      playerName: this.state.playerName,
      prompt: true,
    },
    channel: this.gameChannel});
    this.setState({submitted :true});
  }

  render() 
  {
    return (
      <form onSubmit = {this.handleSubmit}>
        <p>{this.state.prompt}</p>
        <form>
        <TextField id="outlined-basic" label="Response" variant="outlined" onChange={this.handleChange}/>
        </form>
        <Button type="submit" variant="contained" id="submit" disabled={this.state.disabled}>
          Submit 
        </Button>
        { this.state.submitted &&
            <p>Vote received!</p>
        }
      </form>
    );
  }
}

// game will pass current player, list of players, and whos turn it is

export default Prompt;
