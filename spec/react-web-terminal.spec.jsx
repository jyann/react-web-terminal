import React from 'react/addons';
import ReactWebTerminal from '../lib/react-web-terminal.jsx';

describe('ReactWebTerminal', function() {
  var component;

  beforeEach(function() {
    component = React.addons.TestUtils.renderIntoDocument(
      <ReactWebTerminal/>
    );
  });

  it('should render', function() {
    expect(component.getDOMNode().className).toEqual('react-web-terminal');
  });
});
