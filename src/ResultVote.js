
import React from 'react';

class ResultVote extends React.Component {

  constructor(props) {
        super(props);
        this.promptAnswers = ["a","b","c"];
        this.votes = new Array(this.promptAnswers.length).fill(0);
  }

  clicked(index){
    this.votes[index] +=1;
    console.log(this.votes);
  }

  render() {
    return <div>
      <button onClick={ (e) => {this.clicked(0)}}>button</button>
    </div>;
  }
}export default ResultVote
