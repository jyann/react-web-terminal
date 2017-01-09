import React from 'react';
import nl2br from 'react-nl2br';
import './react-web-terminal.scss';

var nonCharKeys = ['Enter', 'Backspace', 'Tab', 'Shift', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Escape', 'Meta', 'Alt', 'Control', 'CapsLock'];

export default class WebTerminal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      log: [],
      logId: 0,
      input: '',
      cursorPos: 0,
      prompt: props.prompt ? props.prompt : '> ',
      commandHandler: props.commandHandler ? props.commandHandler : component => component.output(component.input())
    };
  }

  componentDidMount() {}

  resetInputBuffer() {
    this.state.input = '';
    this.state.cursorPos = 0;
  }

  input() {
    return this.state.input;
  }

  addToLog(text, className) {
    this.state.log.push({
      'id': this.state.logId,
      'class': className,
      'text': text
    });

    this.state.logId++;

    this.setState(this.state);
    // TODO update scroll position
  }

  output(output) {
    this.addToLog(output, 'react-web-terminal-output');
  }

  onCommandEntered() {
    this.addToLog(this.state.prompt + this.input(), 'react-web-terminal-input');

    this.state.commandHandler(this);

    this.resetInputBuffer();
  }

  handleKeyDown(e) {
    // TODO cross browser support
    if (e.key === 'Enter') {
      this.onCommandEntered();
    } else if (e.key === 'Backspace') {
      let newPreCursorStr = this.getPreCursorStr().slice(0, this.getPreCursorStr().length - 1);
      this.state.input = newPreCursorStr + this.state.input.charAt(this.state.cursorPos) + this.getPostCursorStr();
      if (this.state.cursorPos > 0) this.state.cursorPos--;
      this.setState(this.state);
    } else if (e.key === 'ArrowLeft') {
      if (this.state.cursorPos > 0) this.state.cursorPos--;
      this.setState(this.state);
    } else if (e.key === 'ArrowRight') {
      if (this.state.cursorPos < this.state.input.length) this.state.cursorPos++;
      this.setState(this.state);
    } else if (nonCharKeys.indexOf(e.key) === -1) {
      this.state.input = this.getPreCursorStr() + e.key + this.state.input.charAt(this.state.cursorPos) + this.getPostCursorStr();
      this.state.cursorPos++;
      this.setState(this.state);
    }
  }

  getCursorChar() {
    let cursorChar = this.state.input.charAt(this.state.cursorPos);
    return cursorChar === '' ? ' ' : cursorChar;
  }

  getPreCursorStr() {
    return this.state.input.slice(0, this.state.cursorPos);
  }

  getPostCursorStr() {
    return this.state.input.slice(this.state.cursorPos + 1, this.state.input.length);
  }

  render() {
    var logNodes = this.state.log.map(function(item) {
      return (
        <div key={item.id} className={item.class}>
          <pre>{nl2br(item.text)}</pre>
        </div>
      );
    });

    return (
      <div tabIndex="-1" className="react-web-terminal" onKeyDown={this.handleKeyDown.bind(this)}>
        {logNodes}
        <div className="react-web-terminal-input">
          <pre>{this.state.prompt}<span className="react-web-terminal-input-buffer">{this.getPreCursorStr()}<span className="react-web-terminal-cursor">{this.getCursorChar()}</span>{this.getPostCursorStr()}</span></pre>
        </div>
      </div>
    );
  }
}
