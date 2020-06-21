(this["webpackJsonpreact-tic-tac-toe"]=this["webpackJsonpreact-tic-tac-toe"]||[]).push([[0],{59:function(e,t,n){e.exports=n(88)},87:function(e,t,n){},88:function(e,t,n){"use strict";n.r(t);var a=n(0),l=n.n(a),s=n(9),o=n.n(s),i=n(15),r=n(16),u=n(14),p=n(22),c=n(19),m=n(122),h=n(121),b=function(e){Object(p.a)(n,e);var t=Object(c.a)(n);function n(e){var a;return Object(i.a)(this,n),(a=t.call(this,e)).state={playerName:a.props.playerName,answer:"",prompt:"",disabled:!1,submitted:!1},a.allPrompts=["What is the best building on campus?","Which professor do you disagree with the most?","What class made you cry the most?","What do you do during long breaks on campus?","What should you never say to a professor?","What was your most embarrassing moment on campus?","What class did you get the worst grade in?","Who's class would you like to TA?","What's your go-to parking spot?","What place on campus is a rip-off?"],a.pubnub=a.props.pubnub,a.gameChannel=a.props.gameChannel,a.handleSubmit=a.handleSubmit.bind(Object(u.a)(a)),a.handleChange=a.handleChange.bind(Object(u.a)(a)),a.promptIndex=a.props.promptIndex,a}return Object(r.a)(n,[{key:"componentDidMount",value:function(){console.log(this.allPrompts[this.promptIndex]),this.setState({prompt:this.allPrompts[this.promptIndex]})}},{key:"handleChange",value:function(e){e.target.value&&this.setState({answer:e.target.value})}},{key:"handleSubmit",value:function(){this.setState({disabled:!0}),this.pubnub.publish({message:{answer:this.state.answer,playerName:this.state.playerName,prompt:!0},channel:this.gameChannel},(function(e){console.log(e)})),this.setState({submitted:!0})}},{key:"render",value:function(){return l.a.createElement("div",{id:"divv"},l.a.createElement("p",null,this.state.prompt),l.a.createElement("form",null,l.a.createElement(h.a,{id:"outlined-basic",label:"Response",variant:"outlined",onChange:this.handleChange})),l.a.createElement(m.a,{variant:"contained",id:"submit",disabled:this.state.disabled,onClick:this.handleSubmit}," Submit"),this.state.submitted&&l.a.createElement("p",null,"Vote received!"))}}]),n}(l.a.Component),d=function(e){Object(p.a)(n,e);var t=Object(c.a)(n);function n(e){var a;return Object(i.a)(this,n),(a=t.call(this,e)).state={playerTurn:a.props.playerTurn,didVote:!a.props.voting,voting:a.props.voting},console.log("update voting",a.state.voting),a.pubnub=a.props.pubnub,a.playerCount=a.props.playerCount,a.gameChannel=a.props.gameChannel,a.promptAnswers=a.props.allAnswers,a.voteArray=a.props.voteArray,a}return Object(r.a)(n,[{key:"clicked",value:function(e){this.setState({didVote:!0}),this.pubnub.publish({message:{vote:!0,index:e},channel:this.gameChannel})}},{key:"clickContinue",value:function(){this.pubnub.publish({message:{continue:!0},channel:this.gameChannel})}},{key:"render",value:function(){var e=this,t=Object.values(this.promptAnswers),n=t.map((function(n){return l.a.createElement(m.a,{variant:"contained",color:"primary",disabled:e.state.didVote,key:n,onClick:e.clicked.bind(e,t.indexOf(n))},n)})),a="";if(!this.state.voting){var s=document.getElementsByClassName("MuiButtonBase-root");if(s)for(var o=0;o<s.length;o++)s[o].childNodes.forEach((function(t){t.innerHTML===e.promptAnswers[e.state.playerTurn]&&(a="Correct answer: "+t.innerHTML)}))}return l.a.createElement("div",null,l.a.createElement("h3",null,"Vote!"),n,l.a.createElement("p",null,a),!this.state.voting&&l.a.createElement("div",null,l.a.createElement("br",null),l.a.createElement(m.a,{variant:"contained",color:"secondary",onClick:this.clickContinue.bind(this)},"Continue")))}}]),n}(l.a.Component),y=function(e){Object(p.a)(n,e);var t=Object(c.a)(n);function n(e){var a;return Object(i.a)(this,n),(a=t.call(this,e)).state={playerName:a.props.playerName,prompting:!0,voting:!0,playerTurn:null},a.gameChannel="game--"+a.roomId,a.allPlayerNames=a.props.allPlayerNames,a.gameOver=!1,a.counter=0,a.allAnswers={},a.pubnub=a.props.pubnub,a.gameChannel=a.props.gameChannel,a.voteArray=new Array(10).fill(0),a.voteCount=0,a.prompts=0,a.playerCount=a.allPlayerNames.length,a.turnIndex=0,a.promptIndex=0,a}return Object(r.a)(n,[{key:"componentDidMount",value:function(){this.pubnub.unsubscribeAll(),this.pubnub.subscribe({channels:[this.gameChannel]}),this.newRound()}},{key:"componentDidUpdate",value:function(){var e=this;this.pubnub.getMessage(this.gameChannel,(function(t){t.message.prompt?(e.prompts++,console.log("prompts",e.prompts),e.allAnswers[t.message.playerName]=t.message.answer,e.prompts>=e.playerCount&&(e.setState({prompting:!1}),e.setState({voting:!0}))):t.message.vote?e.updateVote(t):t.message.continue&&e.newRound()}))}},{key:"newRound",value:function(){this.setState({playerTurn:this.allPlayerNames[this.turnIndex]}),this.promptIndex++,this.prompts=0,this.voteCount=0,this.promptIndex>9&&(this.promptIndex-=9),this.turnIndex++,this.setState({prompting:!0}),console.log("update voting",this.state.voting),this.turnIndex===this.playerCount&&console.log("END GAME???")}},{key:"updateVote",value:function(e){e.message.vote&&(this.voteCount++,this.voteArray[e.message.index]++,console.log(this.voteCount)),this.voteCount===this.playerCount&&(console.log("set voting false"),this.setState({voting:!1}))}},{key:"render",value:function(){var e;return e="It's ".concat(this.state.playerTurn,"'s turn!"),l.a.createElement("div",{className:"game"},l.a.createElement("div",{className:"turn-container"},this.state.prompting&&l.a.createElement("p",null,e),this.state.prompting&&l.a.createElement(b,{playerTurn:this.state.playerTurn,promptIndex:this.promptIndex,playerName:this.state.playerName,pubnub:this.pubnub,gameChannel:this.gameChannel}),!this.state.prompting&&this.state.voting&&l.a.createElement(d,{allAnswers:this.allAnswers,voteArray:this.voteArray,voting:this.state.voting,playerTurn:this.state.playerTurn,pubnub:this.pubnub,gameChannel:this.gameChannel}),!this.state.prompting&&!this.state.voting&&l.a.createElement(d,{allAnswers:this.allAnswers,voteArray:this.voteArray,voting:this.state.voting,playerTurn:this.state.playerTurn,pubnub:this.pubnub,gameChannel:this.gameChannel})))}}]),n}(l.a.Component),g=n(50),v=n.n(g),C=n(34),f=n.n(C),E=n(51),w=n.n(E),N=(n(87),n(124)),k=function(e){Object(p.a)(n,e);var t=Object(c.a)(n);function n(e){var a;return Object(i.a)(this,n),(a=t.call(this,e)).nameModal={font:"Roboto",position:"top",allowOutsideClick:!1,title:"Enter your name",input:"text",confirmButtonText:"Enter",preConfirm:function(e){if(!Boolean(e))return!1;a.setState({playerName:e}),a.setState({inRoom:!0}),a.pubnub.publish({message:{playerName:e},channel:a.lobbyChannel},(function(e,t){console.log("Status, Result: ",e,t)}))}},a.onPressCreate=function(e){a.roomId=w.a.generate().substring(0,5),a.lobbyChannel="tictactoelobby--"+a.roomId,a.pubnub.subscribe({channels:[a.lobbyChannel],withPresence:!0}),f.a.fire(a.nameModal),a.setState({isRoomCreator:!0})},a.joinRoomModal={font:"Roboto",position:"top",input:"text",allowOutsideClick:!1,inputPlaceholder:"Enter the room id",showCancelButton:!0,confirmButtonColor:"rgb(208,33,41)",confirmButtonText:"OK",width:275,padding:"0.7em",customClass:{heightAuto:!1,popup:"popup-class",confirmButton:"join-button-class ",cancelButton:"join-button-class"},preConfirm:function(e){console.log("INPUT: ",e),e&&a.joinRoom(e)}},a.onPressJoin=function(e){var t=[];t.push(a.joinRoomModal),t.push(a.nameModal),f.a.queue(t)},a.joinRoom=function(e){a.roomId=e,a.lobbyChannel="tictactoelobby--"+a.roomId,a.setState({inRoom:!0}),a.pubnub.hereNow({channels:[a.lobbyChannel]}).then((function(e){0<e.totalOccupancy&&e.totalOccupancy<a.maxPlayers?a.pubnub.subscribe({channels:[a.lobbyChannel],withPresence:!0}):(f.a.close(),f.a.fire({position:"top",allowOutsideClick:!1,title:"Error",text:"Could not enter room",width:275,padding:"0.7em",customClass:{heightAuto:!1,title:"title-class",popup:"popup-class",confirmButton:"button-class"}}),a.reset())})).catch((function(e){console.log(e)}))},a.pubnub=new v.a({publishKey:"pub-c-aa028895-a93c-4692-88ab-38bd83c46fbf",subscribeKey:"sub-c-20f9cc86-b316-11ea-875a-ceb74ea8e96a",openHelp:!1}),a.state={playerName:"",playerId:null,isPlaying:!1,inRoom:!1,isRoomCreator:!1,isDisabled:!1,allPlayerNames:[]},a.lobbyChannel=null,a.roomId=null,a.pubnub.init(Object(u.a)(a)),a.maxPlayers=2,a.handleOpenHelp=a.handleOpenHelp.bind(Object(u.a)(a)),a.handleCloseHelp=a.handleCloseHelp.bind(Object(u.a)(a)),a}return Object(r.a)(n,[{key:"componentWillUnmount",value:function(){this.pubnub.unsubscribe({channels:[this.lobbyChannel]})}},{key:"componentDidUpdate",value:function(){var e=this;null!=this.lobbyChannel&&this.pubnub.getMessage(this.lobbyChannel,(function(t){if(e.state.isRoomCreator&&t.message.playerName){var n=e.state.allPlayerNames.concat(t.message.playerName);e.setState({allPlayerNames:n})}e.state.allPlayerNames&&e.state.allPlayerNames.length===e.maxPlayers&&e.pubnub.publish({message:{allPlayerNames:e.state.allPlayerNames,isPlaying:!0},channel:e.lobbyChannel}),t.message.isPlaying&&e.setState({isPlaying:!0,allPlayerNames:t.message.allPlayerNames})}))}},{key:"reset",value:function(){this.setState({playerName:"",playerId:null,isPlaying:!1,inRoom:!1,isRoomCreator:!1,isDisabled:!1,allPlayerNames:[]}),this.pubnub.unsubscribeAll(),this.lobbyChannel=null,this.roomId=null,this.pubnub.init(this),this.maxPlayers=2}},{key:"handleOpenHelp",value:function(){this.setState({openHelp:!0})}},{key:"handleCloseHelp",value:function(){this.setState({openHelp:!1})}},{key:"render",value:function(){var e=this;return l.a.createElement("html",null,l.a.createElement("head",null,l.a.createElement("title",null,"UVic game")),l.a.createElement("body",null,l.a.createElement("div",{class:"heading"},l.a.createElement("div",{className:"Help"},l.a.createElement(m.a,{id:"help",variant:"outlined",color:"primary",onClick:this.handleOpenHelp},"Help"),l.a.createElement(N.a,{id:"dialog",open:this.state.openHelp,onClose:this.handleCloseHelp},l.a.createElement("h1",null,"Rules:"),l.a.createElement("ul",null,l.a.createElement("li",null,"To start, one person is it, let's say her name is Lucy"),l.a.createElement("li",null,"Everyone gets a prompt"),l.a.createElement("li",null,"Answer the prompt as if you were Lucy"),l.a.createElement("li",null,"Once everyone has answered, you'll see everyone's answers"),l.a.createElement("li",null,"Click on the one you think is Lucy's"),l.a.createElement("li",null,"You'll see which one was right"),l.a.createElement("li",null,"Then it's the next person's turn!")))),l.a.createElement("h1",null,"The UVic game!")),!this.state.inRoom&&l.a.createElement("div",{className:"loginScreen"},l.a.createElement("div",{className:"button-container"},l.a.createElement(m.a,{id:"create",variant:"contained",onClick:function(t){return e.onPressCreate()}}," ","Create a new game"),l.a.createElement(m.a,{id:"join",variant:"contained",onClick:function(t){return e.onPressJoin()}}," ","Join a game"))),!this.state.isPlaying&&this.state.inRoom&&l.a.createElement("div",null,l.a.createElement("p",null,"Your Room Id: ",l.a.createElement("span",{id:"meetingID"},this.roomId)),l.a.createElement("p",null,"Waiting for players... ",l.a.createElement("br",null),l.a.createElement("br",null))),this.state.isPlaying&&l.a.createElement(y,{pubnub:this.pubnub,gameChannel:"game--"+this.roomId,playerName:this.state.playerName,allPlayerNames:this.state.allPlayerNames,isRoomCreator:this.state.isRoomCreator,endGame:this.endGame})))}}]),n}(a.Component);o.a.render(l.a.createElement(k,null),document.getElementById("root"))}},[[59,1,2]]]);
//# sourceMappingURL=main.5de69d1e.chunk.js.map