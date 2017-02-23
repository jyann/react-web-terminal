import React from 'react';

import {getKey} from './key-prop-support';
import WebTerminalInput from './react-web-terminal-input.jsx';

export default class WebTerminal extends React.Component {
  // TODO add inline styles so they can be changed dynamically
  constructor(props) {
    super(props);

    this.state = {
      log: [],
      logId: 0,
      commandHandler: props.commandHandler ? props.commandHandler : (component) => { component.output(component.input()) },
      style: {
        reactWebTerminal: {},
        reactWebTerminalInput: {},
        reactWebTerminalInputBuffer: {},
        reactWebTerminalCursor: {}
      }
    };
  }

  componentDidUpdate() {
    this.root.scrollTop = this.root.scrollHeight;
  }

  addToLog(text, className) {
    this.state.log.push({
      'id': this.state.logId,
      'class': className,
      'text': text
    });

    this.state.logId++;

    this.setState(this.state);
  }

  input() {
    return this.inputComp.getInput();
  }

  output(output) {
    this.addToLog(output, 'react-web-terminal-output');
  }

  resetInputBuffer() {
    this.inputComp.resetInputBuffer();
  }

  handleKeyDown(e) {
    this.inputComp.handleKeyDown(e);
  }

  onCommandEntered() {
    this.addToLog(this.inputComp.state.prompt + this.input(), 'react-web-terminal-input');

    this.state.commandHandler(this);

    this.resetInputBuffer();

    this.setState(this.state);
  }

  render() {
    let logNodes = this.state.log.map(function(item) {
      return (
        <div key={item.id} className={item.class}>
          <pre>{item.text}</pre>
        </div>
      );
    });

    return (
      <div tabIndex="-1" ref={(root) => { this.root = root }} className="react-web-terminal" onKeyDown={this.handleKeyDown.bind(this)}>
        {logNodes}
        <WebTerminalInput ref={(input) => { this.inputComp = input }} prompt={this.props.prompt} onCommandEntered={this.onCommandEntered.bind(this)} />
      </div>
    );
  }
}
