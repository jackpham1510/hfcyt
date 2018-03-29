import React from 'react'
import io from 'socket.io-client'
import { CSSTransition } from 'react-transition-group'

/*Import Some Component*/
import Intro from './Intro'

/*Import CSS*/ 
import './App.css'
import 'element-theme-default'

export default class extends React.Component{
  state = {
    pointUp: false,
    showIntro: true,
    score: 0,
    rank: 0,
    leaderboard: [],
    wordList: []
  };
  id = null
  nickname = '';
  socket = io();
  constructor(props){
    super(props)
    this.handleNewUser = this.handleNewUser.bind(this)
    this.handleSendWord = this.handleSendWord.bind(this)
  }
  handleNewUser(e){
    e.preventDefault();
    this.setState({ showIntro: false });
    this.nickname = this.inputNickName.value;
    this.socket.emit('new user', this.nickname);
    this.socket.on('new user', id => { this.id = id })
    this.socket.on('new wordlist', wordList => this.setState({ wordList }))
    this.socket.on('point up', () => this.setState({ pointUp: true }))
    this.socket.on('update leaderboard', lb => {
      let index
      for (let i = 0; i < lb.length; i++){
        if (lb[i].id === this.id){
          index = i; break;
        }
      }
      this.setState({ leaderboard: lb, score: lb[index].score, rank: index + 1 })
    })
  }
  handleSendWord(e){
    e.preventDefault()
    this.socket.emit('input word', this.inputWord.value)
    this.inputWord.value = ''
  }
  formatString(s){
    return s.length > 20 ? (s.substring(0, 20) + '...') : s
  }
  render(){
    let nickname = this.formatString(this.nickname)
    let {showIntro, score, rank, leaderboard, wordList, pointUp} = this.state
    return (
      <div className="block--fullscreen block--black block--opacity-90">
        {
          showIntro ?
          <Intro onSubmit={this.handleNewUser} myref={el => { this.inputNickName = el }}/>:
          <div className="block--width container">

            {/* Leaderboard */}
            <div className="leaderboard block--width">
              <h1 className="text--center">LeaderBoard</h1>
              {leaderboard.map((user, index) => (
                <p className="leaderboard__line" key={user.id}>
                  #{index + 1}
                  <span className="leaderboard__name">{this.formatString(user.nickname)}</span>
                  <span className="leaderboard__score">{user.score}</span>
                </p>))}
            </div>
            
            {/* Word list */}
            <div className="wordlist">
              {wordList.map((word, index) => (
                <p key={index} className="wordlist__word block--width text--center">{word}</p>
              ))}
            </div>

            {/* Form input */}
            <form id="main-form" action="" className="block--width block--bottom" onSubmit={this.handleSendWord}>
              <p className="title">
                <small>{nickname} -{" "}
                <span style={{position: 'relative'}}>
                  <CSSTransition in={pointUp} timeout={500} classNames="point-up" onEntered={() => this.setState({ pointUp: false })}>
                    <span className="point-up">+10</span>
                  </CSSTransition>
                  Score: {score}
                </span> - 
                Rank: {rank}</small>
              </p>
              <input ref={el => { this.inputWord = el }} 
                     type="text" placeholder="Type here" className="el-input__inner text--center" autoComplete="off" />
              <button type="submit" className="el-button el-button--primary form__submit block--full-width">Submit</button>
            </form>
          </div>
        }
        {/* Footer */}
        <div className="footer">
          Make with <span role="img" aria-label="img">❤️</span> by Phạm Dũng
        </div>
      </div>
    )
  }
}



