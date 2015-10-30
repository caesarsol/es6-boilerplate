import React from 'react'
import { render } from 'react-dom'
import { Dispatcher } from 'flux'

class Counter extends React.Component {
  constructor(...args) {
    super(...args)
    this.state = { count: 0 }
  }

  componentWillMount() {
    this.props.disp.register( ({ action }) => {
      console.log('Received action')
      if (action == 'INC')
        this.setState({count: this.state.count + 1})
    })
  }

  render() {
    return <div>{this.state.count}</div>
  }
}

class Button extends React.Component {
  sendAction() {
    this.props.disp.dispatch({
      action: this.props.actionName
    })
  }

  render() {
    return <button onClick={() => this.sendAction()}>increment</button>
  }
}

let disp = new Dispatcher()

render(<Counter disp={disp} />, document.getElementById('first'))

render(<Button disp={disp} actionName="INC" />, document.getElementById('second'))
