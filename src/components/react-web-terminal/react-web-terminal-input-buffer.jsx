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

  insertText(text) {
    this.state.input = this.getPreCursorStr() + text + this.cursor.getCursorChar() + this.getPostCursorStr();
    this.cursor.moveRight(text.length);
    this.setState(this.state);
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
    } else if (nonPrintableKeys.indexOf(key) === -1 && !e.altKey && !e.ctrlKey && !e.metaKey) {
      this.insertText(key);
    }
  }

  onPaste(e) {
    const pastedText = e.clipboardData.getData('Text');
    this.insertText(pastedText);
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
