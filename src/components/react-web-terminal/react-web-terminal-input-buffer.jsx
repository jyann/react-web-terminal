import React from 'react';

import {getKey, nonPrintableKeys} from './react-web-terminal-keyboard-data';
import WebTerminalCursor from './react-web-terminal-cursor.jsx';

export default class WebTerminalInputBuffer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      input: ''
    };
  }

  getInput() {
      return this.state.input;
  }

  resetInputBuffer() {
    this.state.input = '';
    this.cursor.moveToBegining();
  }

  handleKeyDown(e) {
    const key = getKey(e);
    if (key === 'Enter') {
      this.onCommandEntered();
    } else if (key === 'Backspace') {
      let newPreCursorStr = this.getPreCursorStr().slice(0, this.getPreCursorStr().length - 1);
      this.state.input = newPreCursorStr + this.cursor.getCursorChar() + this.getPostCursorStr();
      this.cursor.moveLeft();
      this.setState(this.state);
    } else if (key === 'ArrowLeft') {
      this.cursor.moveLeft();
      this.forceUpdate();
    } else if (key === 'ArrowRight') {
      this.cursor.moveRight();
      this.forceUpdate();
    } else if (nonPrintableKeys.indexOf(key) === -1) {
      this.state.input = this.getPreCursorStr() + key + this.cursor.getCursorChar() + this.getPostCursorStr();
      this.cursor.moveRight();
      this.setState(this.state);
    }
  }

  onCommandEntered() {
    if (this.props.onCommandEntered) this.props.onCommandEntered();
  }

  getPreCursorStr() {
    const cursorPos = this.cursor ? this.cursor.getCursorPos() : 0;
    return this.getInput().slice(0, cursorPos);
  }

  getPostCursorStr() {
    const cursorPos = this.cursor ? this.cursor.getCursorPos() : 0;
    return this.getInput().slice(cursorPos + 1, this.getInput().length);
  }

  render() {
    return (
      <span className="react-web-terminal-input-buffer">{this.getPreCursorStr()}<WebTerminalCursor ref={(cursor) => { this.cursor = cursor; }} inputMethod={this.getInput.bind(this)} />{this.getPostCursorStr()}</span>
    );
  }
}
