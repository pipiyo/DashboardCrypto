import React, { Component } from 'react';

class Nav extends Component {

  render() {
    return (
      <div className="nav">
        <h1>Digital Cryptocurrency Dashboard</h1>
        <input onClick={this.props.show} type="button" value="BTC" className="buttonGrande BTC"></input>
        <input onClick={this.props.show} type="button" value="ETH" className="buttonGrande ETH"></input>
      </div>
    );
  }
}


export default Nav;
