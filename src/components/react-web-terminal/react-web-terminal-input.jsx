import React from 'react';

import WebTerminalInputBuffer from './react-web-terminal-input-buffer.jsx';

export default class WebTerminalInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      prompt: props.prompt ? props.prompt : '> '
    };
  }

  getInput() {
    return this.buffer.getInput();
  }

  resetInputBuffer() {
    this.buffer.resetInputBuffer();
  }

  handleKeyDown(e) {
    this.buffer.handleKeyDown(e);
  }

  onCommandEntered() {
    if (this.props.onCommandEntered) this.props.onCommandEntered();
  }

  render() {
    return (
      <div className="react-web-terminal-input">
        <pre>{this.state.prompt}<WebTerminalInputBuffer ref={(buffer) => { this.buffer = buffer; }} onCommandEntered={this.onCommandEntered.bind(this)} /></pre>
      </div>
    );
  }
}
