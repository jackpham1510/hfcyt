import React from 'react'

const styles = {
  typesor: {
    position: 'absolute',
    background: 'white',
    height: '100%',
    width: '5px',
    animation: 'typesor 1s ease-in-out infinite',
  }
}

export default class extends React.Component{
  title= null;
  componentDidMount(){
    const s = 'How Fast Can You Type?';
    let i = 0;
    let title = this.title
    let itv = setInterval(function (){
      if (i === s.length) {
        clearInterval(itv);
        return;
      }
      title.innerHTML += s[i++];
    }, 100)
  }
  render(){
    return (
      <div className="block--fullscreen block--flex block--flex-center-xy">
        <form action="" onSubmit={this.props.onSubmit} className="block--min-max-width">
          <h2 className="title">
            <span ref={el => this.title = el}></span>
            <span style={styles.typesor}></span>
          </h2>
          <input ref={this.props.myref} type="text" placeholder="Type your nick name here" className="el-input__inner text--center" autoComplete="off" />
          <button type="submit" className="el-button el-button--primary form__submit block--full-width">Let's Go</button>
        </form>
      </div>
    )
  }
}