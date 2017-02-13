import React from 'react';

import {getKey} from './key-prop-support';

const nonCharKeys = [
    'Backspace', 'Tab', 'Clear', 'Enter', 'Shift', 'Control', 'Alt', 'CapsLock', 'Escape', 'PageUp', 'PageDown', 'End', 'Home', 'Delete', 'Meta',
    'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'F13', 'F14', 'F15', 'F16', 'F17', 'F18', 'F19'
];

export default class WebTerminal extends React.Component {
  // TODO add inline styles so they can be changed dynamically
  constructor(props) {
    super(props);

    this.state = {
      log: [],
      logId: 0,
      input: '',
      cursorPos: 0,
      prompt: props.prompt ? props.prompt : '> ',
      commandHandler: props.commandHandler ? props.commandHandler : component => component.output(component.input()),
      style: {
        reactWebTerminal: {},
        reactWebTerminalInput: {},
        reactWebTerminalInputBuffer: {},
        reactWebTerminalCursor: {}
      }
    };
  }

  componentDidMount() {}

  componentDidUpdate() {
    this.refs.root.scrollTop = this.refs.root.scrollHeight
  }

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
    const key = getKey(e);
    if (key === 'Enter') {
      this.onCommandEntered();
    } else if (key === 'Backspace') {
      let newPreCursorStr = this.getPreCursorStr().slice(0, this.getPreCursorStr().length - 1);
      this.state.input = newPreCursorStr + this.state.input.charAt(this.state.cursorPos) + this.getPostCursorStr();
      if (this.state.cursorPos > 0) this.state.cursorPos--;
      this.setState(this.state);
    } else if (key === 'ArrowLeft') {
      if (this.state.cursorPos > 0) this.state.cursorPos--;
      this.setState(this.state);
    } else if (key === 'ArrowRight') {
      if (this.state.cursorPos < this.state.input.length) this.state.cursorPos++;
      this.setState(this.state);
    } else if (nonCharKeys.indexOf(key) === -1) {
      this.state.input = this.getPreCursorStr() + key + this.state.input.charAt(this.state.cursorPos) + this.getPostCursorStr();
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
          <pre>{item.text}</pre>
        </div>
      );
    });

    return (
      <div tabIndex="-1" ref="root" className="react-web-terminal" onKeyDown={this.handleKeyDown.bind(this)} style={this.state.style.reactWebTerminal}>
        {logNodes}
        <div className="react-web-terminal-input" style={this.state.style.reactWebTerminalInput}>
          <pre>{this.state.prompt}<span className="react-web-terminal-input-buffer" style={this.state.style.reactWebTerminalInputBuffer}>{this.getPreCursorStr()}<span className="react-web-terminal-cursor" style={this.state.style.reactWebTerminalCursor}>{this.getCursorChar()}</span>{this.getPostCursorStr()}</span></pre>
        </div>
      </div>
    );
  }
}
