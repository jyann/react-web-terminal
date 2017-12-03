import React from 'react';

import {getKeyStroke} from './react-web-terminal-keyboard-data';
import WebTerminalInput from './react-web-terminal-input.jsx';

export default class WebTerminal extends React.Component {
  // TODO add inline styles so they can be changed dynamically
  // TODO add ability to disable/enable input buffer
  // TODO add ajax call function that disables input then re-enables after callback runs
  // TODO unicode support
  constructor(props) {
    super(props);

    this.state = {
      log: [],
      logId: 0,
      commandHandler: props.commandHandler ? props.commandHandler : component => component.output(component.input()),
      keyStrokeMap: props.keyStrokeMap || {},
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

    this.resetInputBuffer();

    this.setState(this.state);
  }

  resetInputBuffer() {
    this.inputComp.resetInputBuffer();
  }

  handleKeyDown(e) {
    if (!this.keyStrokeMapHandler(e)) this.inputComp.handleKeyDown(e);
  }

  onPaste(e) {
    this.inputComp.onPaste(e);
  }

  onCommandEntered() {
    this.addToLog(this.inputComp.state.prompt + this.input(), 'react-web-terminal-input');
    this.state.commandHandler(this);
  }

  keyStrokeMapHandler(e) {
    const keyStroke = getKeyStroke(e);
    if (keyStroke in this.state.keyStrokeMap)
      return this.state.keyStrokeMap[keyStroke](this) !== false ? true : false;
    else
      return false;
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
      <div tabIndex="-1" ref={(root) => { this.root = root }} className="react-web-terminal" onKeyDown={this.handleKeyDown.bind(this)} onPaste={this.onPaste.bind(this)}>
        {logNodes}
        <WebTerminalInput ref={(input) => { this.inputComp = input }} prompt={this.props.prompt} onCommandEntered={this.onCommandEntered.bind(this)} />
      </div>
    );
  }
}
