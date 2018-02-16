import React, { Component } from 'react';

import GraficoMes from './GraficoMes';
import GraficoHora from './GraficoHora';

class Graficos extends Component {

  render() {
    return (
      <div>
	      <div className="nav">
	        <input onClick={this.props.filtro} type="button" value="mes" className="buttonPequeño mes"></input>
	        <input onClick={this.props.filtro} type="button" value="hora" className="buttonPequeño hora"></input>
	      </div>
	      { 
	      	(this.props.filtroValor == 'mes') ? 
	      		<GraficoMes 
	      			data={this.props.data}
	      			precio={this.props.precio} />
	      	: 
	      		<GraficoHora
	      			data={this.props.data}
	      			precio={this.props.precio} />
	      }
	  		
	  		
      </div>
    );
  }
}


export default Graficos;
