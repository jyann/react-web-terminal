import React from 'react';

export default class WebTerminalCursor extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        cursorPos: 0
      };
    }

    getInput() {
      return this.props.inputMethod ? this.props.inputMethod() : '';
    }

    getCursorPos() {
      return this.state.cursorPos;
    }

    setCursorPos(newPos) {
      this.state.cursorPos = newPos;
      this.setState(this.state);
    }

    moveLeft() {
      if (this.state.cursorPos > 0)
        this.setCursorPos(this.getCursorPos() - 1);
    }

    moveRight() {
      if (this.state.cursorPos < this.getInput().length)
        this.setCursorPos(this.getCursorPos() + 1);
    }

    moveToBegining() {
      this.setCursorPos(0);
    }

    moveToEnd() {
      this.setCursorPos(this.getInput().length);
    }

    getCursorChar() {
      return this.getInput().charAt(this.getCursorPos());
    }

    render() {
        const cursorChar = this.getCursorChar();
        return (
          <span className="react-web-terminal-cursor">{cursorChar === '' ? ' ' : cursorChar}</span>
        );
    }
}
