import React from 'react/addons';
import WebTerminal from '../lib/react-web-terminal.jsx';

describe('WebTerminal', function() {
  var component;

  beforeEach(function() {
    component = React.addons.TestUtils.renderIntoDocument(
      <WebTerminal/>
    );
  });

  it('should render', function() {
    expect(React.findDOMNode(component).className).toEqual('react-web-terminal');
  });
});
