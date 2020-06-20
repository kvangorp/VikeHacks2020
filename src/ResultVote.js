
import React from 'react';

class ResultVote extends React.Component {

  constructor(props) {
    super(props);
    this.promptAnswers = ["raining cats and dogs","cloudy with a chance of meat balls","always sunny in philidalphia"];
    this.votes = new Array(this.promptAnswers.length).fill(0);
  }

  makeButtons(props) {
    const butts = props.butts;
    const buttItems = butts.map((butt) =>
    <button key={butt.toString()}>
      {butt}
    </button>
    );
    return (
      <div text-align = "center">{buttItems}</div>
    );
  }

  clicked(index){
    this.votes[index] +=1;
    console.log(this.votes);
  }

  render() {
    return <div>
      <this.makeButtons butts={this.promptAnswers} />
      <button onClick={ (e) => {this.clicked(0)}}>button</button>
    </div>;
  }
}export default ResultVote
