import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as duck from './redux/duck';
import Layout from './Layout';

@connect(
  state => ({
    ...duck.selector(state.tools)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...duck
    }, dispatch)
  })
)
class Application extends Component {
  constructor(props) {
    super (props);
  }

  componentDidMount() {
    console.log('component did mount, fetching data');
    this.props.actions.fetchData();
  }

  render() {
    return (<Layout {...this.props}/>);
  }
}
export default Application;