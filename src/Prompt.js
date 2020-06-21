import React from 'react';

class Prompt extends React.Component 
{
  constructor(props) {
    super(props);
    this.state = {
      playerName: this.props.playerName,
      answer: "",
      prompt: "",
    };
    this.allPrompts = ["what is your favoirite building", "what is your favorite class"]
    this.pubnub = this.props.pubnub
    this.gameChannel = this.props.gameChannel

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount()
  {
    //var rand = //random number
    console.log(this.allPrompts[0])
    this.setState({prompt:this.allPrompts[0]})
  }

  handleChange(event) 
  {
    this.setState({answer: event.target.value});
  }

  handleSubmit()
  {
    this.pubnub.publish({message: {
      answer: this.state.answer,
      playerName: this.state.playerName,
      prompt: true,
    },
    channel: this.gameChannel});
  }

  render() 
  {
    return (
      <div>
        <p>
          {this.state.prompt}
        </p>
        <form>
          <input type="text" onChange={this.handleChange}></input>
        </form>
        <button onClick={this.handleSubmit}>Submit</button>
      </div>
    );
  }
}

// game will pass current player, list of players, and whos turn it is

export default Prompt;
