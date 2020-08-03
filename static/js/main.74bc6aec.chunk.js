(this["webpackJsonpreact-tic-tac-toe"]=this["webpackJsonpreact-tic-tac-toe"]||[]).push([[0],{49:function(e,t,a){e.exports=a(78)},77:function(e,t,a){},78:function(e,t,a){"use strict";a.r(t);var n=a(0),s=a.n(n),o=a(7),l=a.n(o),r=a(12),i=a(13),u=a(20),p=a(17),m=a(15),h=a(110),c=a(109),b=function(e){Object(p.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(r.a)(this,a),(n=t.call(this,e)).state={playerName:n.props.playerName,answer:"",prompt:"",disabled:!1,submitted:!1},n.allPrompts=["What is the best building on campus?","Which professor do you disagree with the most?","What class made you cry the most?","What do you do during long breaks on campus?","What should you never say to a professor?","What was your most embarrassing moment on campus?","What class did you get the worst grade in?","Who's class would you like to TA?","What's your go-to parking spot?","What place on campus is a rip-off?","Which class did you skip the most","Which coffee shop has the best coffee","If you had to choose another major, what would it be?","What's your dream job?","Best bathroom on campus?","Building I get lost in","Best study spot","Most over rated study spot","The first school event I went to was...","One school event I'd like to got to is...","Most embaressing thing that's ever happened to me on campus"],n.pubnub=n.props.pubnub,n.gameChannel=n.props.gameChannel,n.handleSubmit=n.handleSubmit.bind(Object(u.a)(n)),n.handleChange=n.handleChange.bind(Object(u.a)(n)),n.promptIndex=n.props.promptIndex,n}return Object(i.a)(a,[{key:"componentDidMount",value:function(){this.setState({prompt:this.allPrompts[this.promptIndex]})}},{key:"handleChange",value:function(e){e.target.value&&this.setState({answer:e.target.value})}},{key:"handleSubmit",value:function(e){e.preventDefault(),this.setState({disabled:!0}),this.pubnub.publish({message:{answer:this.state.answer,playerName:this.state.playerName,prompt:!0},channel:this.gameChannel}),this.setState({submitted:!0})}},{key:"render",value:function(){return s.a.createElement("form",{onSubmit:this.handleSubmit},s.a.createElement("p",null,this.state.prompt),s.a.createElement("form",null,s.a.createElement(c.a,{id:"outlined-basic",label:"Response",variant:"outlined",onChange:this.handleChange})),s.a.createElement(h.a,{type:"submit",variant:"contained",id:"submit",disabled:this.state.disabled},"Submit"),this.state.submitted&&s.a.createElement("p",null,"Vote received!"))}}]),a}(s.a.Component),d=function(e){Object(p.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(r.a)(this,a),(n=t.call(this,e)).state={playerTurn:n.props.playerTurn,didVote:!n.props.voting,voting:n.props.voting},n.pubnub=n.props.pubnub,n.playerCount=n.props.playerCount,n.gameChannel=n.props.gameChannel,n.promptAnswers=n.props.allAnswers,n.voteArray=n.props.voteArray,n}return Object(i.a)(a,[{key:"clicked",value:function(e){this.setState({didVote:!0}),this.pubnub.publish({message:{vote:!0,index:e},channel:this.gameChannel})}},{key:"clickContinue",value:function(){this.pubnub.publish({message:{continue:!0},channel:this.gameChannel})}},{key:"render",value:function(){var e,t=this,a=Object.values(this.promptAnswers),n=a.map((function(e){return s.a.createElement(h.a,{variant:"contained",color:"primary",disabled:t.state.didVote,key:e,onClick:t.clicked.bind(t,a.indexOf(e))},e)}));if(!this.state.voting){var o=document.getElementsByClassName("MuiButtonBase-root");if(o)for(var l=0;l<o.length;l++)o[l].childNodes.forEach((function(a){a.innerHTML===t.promptAnswers[t.state.playerTurn]&&(e="Correct answer: "+a.innerHTML)}))}return s.a.createElement("div",null,s.a.createElement("h3",null,"Vote!"),n,s.a.createElement("p",null,e),!this.state.voting&&s.a.createElement("div",null,s.a.createElement("br",null),s.a.createElement(h.a,{variant:"contained",color:"secondary",onClick:this.clickContinue.bind(this)},"Continue")))}}]),a}(s.a.Component),y=function(e){Object(p.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(r.a)(this,a),(n=t.call(this,e)).state={playerName:n.props.playerName,prompting:!0,voting:!0,playerTurn:null},n.playerName=n.props.playerName,n.gameChannel="game--"+n.roomId,n.allPlayerNames=n.props.allPlayerNames,n.gameOver=!1,n.counter=0,n.allAnswers={},n.pubnub=n.props.pubnub,n.gameChannel=n.props.gameChannel,n.voteArray=new Array(10).fill(0),n.voteCount=0,n.prompts=0,n.playerCount=n.allPlayerNames.length,n.turnIndex=0,n.promptIndex=0,n}return Object(i.a)(a,[{key:"componentDidMount",value:function(){this.pubnub.unsubscribeAll(),this.pubnub.subscribe({channels:[this.gameChannel]}),this.newRound()}},{key:"componentDidUpdate",value:function(){var e=this;this.pubnub.getMessage(this.gameChannel,(function(t){t.message.prompt?(e.prompts++,e.allAnswers[t.message.playerName]=t.message.answer,e.prompts>=e.playerCount&&(e.setState({prompting:!1}),e.setState({voting:!0}))):t.message.vote?e.updateVote(t):t.message.continue&&e.newRound()}))}},{key:"newRound",value:function(){this.setState({playerTurn:this.allPlayerNames[this.turnIndex]}),this.promptIndex++,this.prompts=0,this.voteCount=0,this.promptIndex>9&&(this.promptIndex-=9),this.turnIndex++,this.setState({prompting:!0}),console.log("update voting",this.state.voting),this.turnIndex,this.playerCount}},{key:"updateVote",value:function(e){e.message.vote&&(this.voteCount++,this.voteArray[e.message.index]++),this.voteCount===this.playerCount-1&&(this.setState({voting:!1}),this.newRound())}},{key:"render",value:function(){var e,t=(null===(e=this.state.playerTurn)||void 0===e?void 0:e.localeCompare(this.playerName))?"It's ".concat(this.state.playerTurn,"'s turn!"):"Your turn";return s.a.createElement("div",{className:"game"},s.a.createElement("div",{className:"nameHeader"},this.playerName),s.a.createElement("div",{className:"turn-container"},this.state.prompting&&s.a.createElement("p",null,t),this.state.prompting&&s.a.createElement(b,{playerTurn:this.state.playerTurn,promptIndex:this.promptIndex,playerName:this.state.playerName,pubnub:this.pubnub,gameChannel:this.gameChannel}),!this.state.prompting&&this.state.voting&&this.state.playerTurn===this.playerName&&s.a.createElement("p",null,"Waiting for players to vote..."),!this.state.prompting&&this.state.voting&&this.state.playerTurn!==this.playerName&&s.a.createElement(d,{allAnswers:this.allAnswers,voteArray:this.voteArray,voting:this.state.voting,playerTurn:this.state.playerTurn,pubnub:this.pubnub,gameChannel:this.gameChannel}),!this.state.prompting&&!this.state.voting&&s.a.createElement(d,{allAnswers:this.allAnswers,voteArray:this.voteArray,voting:this.state.voting,playerTurn:this.state.playerTurn,pubnub:this.pubnub,gameChannel:this.gameChannel})))}}]),a}(s.a.Component),g=a(42),v=a.n(g),C=a(27),f=a.n(C),w=a(43),E=a.n(w),N=(a(77),function(e){Object(p.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(r.a)(this,a),(n=t.call(this,e)).nameModal={font:"Roboto",position:"top",allowOutsideClick:!1,title:"Enter your name",input:"text",confirmButtonText:"Enter",preConfirm:function(e){if(!Boolean(e))return!1;n.setState({playerName:e}),n.setState({inRoom:!0}),n.pubnub.publish({message:{playerName:e},channel:n.lobbyChannel},(function(e,t){console.log("Status, Result: ",e,t)}))}},n.onPressCreate=function(e){n.roomId=E.a.generate().substring(0,5),n.lobbyChannel="tictactoelobby--"+n.roomId,n.pubnub.subscribe({channels:[n.lobbyChannel],withPresence:!0}),f.a.fire(n.nameModal),n.setState({isRoomCreator:!0})},n.joinRoomModal={font:"Roboto",position:"top",input:"text",allowOutsideClick:!1,inputPlaceholder:"Enter the room id",showCancelButton:!0,confirmButtonColor:"rgb(208,33,41)",confirmButtonText:"OK",width:275,padding:"0.7em",customClass:{heightAuto:!1,popup:"popup-class",confirmButton:"join-button-class ",cancelButton:"join-button-class"},preConfirm:function(e){e&&n.joinRoom(e)}},n.onPressJoin=function(e){var t=[];t.push(n.joinRoomModal),t.push(n.nameModal),f.a.queue(t)},n.onPressStart=function(e){n.pubnub.publish({message:{allPlayerNames:n.state.allPlayerNames,isPlaying:!0},channel:n.lobbyChannel})},n.joinRoom=function(e){n.roomId=e,n.lobbyChannel="tictactoelobby--"+n.roomId,n.setState({inRoom:!0}),n.pubnub.hereNow({channels:[n.lobbyChannel]}).then((function(e){0<e.totalOccupancy?n.pubnub.subscribe({channels:[n.lobbyChannel],withPresence:!0}):(f.a.close(),f.a.fire({position:"top",allowOutsideClick:!1,title:"Error",text:"Could not enter room",width:275,padding:"0.7em",customClass:{heightAuto:!1,title:"title-class",popup:"popup-class",confirmButton:"button-class"}}),n.reset())})).catch((function(e){console.log(e)}))},n.pubnub=new v.a({publishKey:"pub-c-c9377952-9ac2-4c85-9d37-c670ea401a9b",subscribeKey:"sub-c-10784c98-b316-11ea-afa6-debb908608d9"}),n.state={playerName:"",playerId:null,isPlaying:!1,inRoom:!1,isRoomCreator:!1,isDisabled:!1,allPlayerNames:[]},n.lobbyChannel=null,n.roomId=null,n.pubnub.init(Object(u.a)(n)),n}return Object(i.a)(a,[{key:"componentWillUnmount",value:function(){this.pubnub.unsubscribe({channels:[this.lobbyChannel]})}},{key:"componentDidUpdate",value:function(){var e=this;null!=this.lobbyChannel&&this.pubnub.getMessage(this.lobbyChannel,(function(t){if(e.state.isRoomCreator&&t.message.playerName){var a=e.state.allPlayerNames.concat(t.message.playerName);e.setState({allPlayerNames:a})}t.message.isPlaying&&e.setState({isPlaying:!0,allPlayerNames:t.message.allPlayerNames})}))}},{key:"reset",value:function(){this.setState({playerName:"",playerId:null,isPlaying:!1,inRoom:!1,isRoomCreator:!1,isDisabled:!1,allPlayerNames:[],maxPlayers:20}),this.pubnub.unsubscribeAll(),this.lobbyChannel=null,this.roomId=null,this.pubnub.init(this)}},{key:"handleOpenRules",value:function(){f.a.fire({font:"Roboto",position:"top",title:"Rules",html:"To start, one person is it, let's say her name is Lucy.Everyone gets a prompt.                                  Answer the prompt as if you were Lucy.                    Once everyone has answered, you'll see everyone's answers.Click on the one you think is Lucy's.                      You'll see which one was right.                            Then it's the next person's turn!                          ",showCloseButton:!0,showConfirmButton:!1})}},{key:"render",value:function(){var e=this;return s.a.createElement("html",null,s.a.createElement("head",null,s.a.createElement("title",null,"UVic game")),s.a.createElement("body",null,s.a.createElement("div",{class:"heading"},s.a.createElement(h.a,{id:"rules-button",variant:"outlined",color:"primary",onClick:this.handleOpenRules},"Rules"),s.a.createElement("h1",null,"The UVic game!")),!this.state.inRoom&&s.a.createElement("div",{className:"loginScreen"},s.a.createElement("div",{className:"button-container"},s.a.createElement(h.a,{id:"create",variant:"contained",onClick:function(t){return e.onPressCreate()}}," ","Create a new game"),s.a.createElement(h.a,{id:"join",variant:"contained",onClick:function(t){return e.onPressJoin()}}," ","Join a game"))),!this.state.isPlaying&&this.state.inRoom&&s.a.createElement("div",null,s.a.createElement("p",null,"Your Room Id: ",s.a.createElement("span",{id:"meetingID"},this.roomId)),s.a.createElement("p",null,"Waiting for players... ",s.a.createElement("br",null),s.a.createElement("br",null)),this.state.isRoomCreator&&s.a.createElement(h.a,{id:"start",variant:"contained",onClick:function(t){return e.onPressStart()}},"Start Game"),this.state.isRoomCreator&&s.a.createElement("p",null,"Players: ",this.state.allPlayerNames.length)),this.state.isPlaying&&s.a.createElement(y,{pubnub:this.pubnub,gameChannel:"game--"+this.roomId,playerName:this.state.playerName,allPlayerNames:this.state.allPlayerNames,isRoomCreator:this.state.isRoomCreator,endGame:this.endGame})))}}]),a}(n.Component));l.a.render(s.a.createElement(N,null),document.getElementById("root"))}},[[49,1,2]]]);
//# sourceMappingURL=main.74bc6aec.chunk.js.map