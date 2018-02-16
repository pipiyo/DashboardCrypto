import React, { Component } from 'react';

import Nav from './Nav';
import Graficos from './Graficos';
import Api from '../api';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
    	show: false,
    	filtroValor: 'mes',
    	data: null,
    	currency: null,
    	precio: null,
    	loading: false,
    	currency: 'BTC'
    }
  }


ordenarMes(data, filtro, currency) {

    data.then( data => {
    	let lista = [];
    	let precio = [];
    	let ordenarFecha;
    	let split;

    	data.forEach( (item, i) => {
    		split = item.split(':');
    		lista[i] = { precio: split[1], fecha: split[0]};
    		precio[i] = split[1];
    	});

		precio = Object.assign([], precio.sort( (a,b) => {
			return a-b;
		}));

    	lista.forEach( (item, i) => {
    		lista[i].barra = precio.indexOf(item.precio); 
    	});

		ordenarFecha = Object.assign([], lista.sort( (a,b) => {
			let c = new Date(a.fecha);
			let d = new Date(b.fecha);
			return c-d;
		}));

    	this.setState({
    		currency: this.state.currency,
    		filtroValor: filtro,
    		data: ordenarFecha,
    		show: true,
    		precio: precio,
    		loading: false
    	});
    });

}

ordenarHora(data, filtro, currency) {

    data.then( data => {
    	let lista = [];
    	let precio = [];
    	let ordenarFecha;
    	let split;

    	data.forEach( (item, i) => {
    		split = item.split('/');
    		lista[i] = { precio: split[1], fecha: split[0]};
    		precio[i] = split[1];
    	});

		precio = Object.assign([], precio.sort( (a,b) => {
			return a-b;
		}));

    	lista.forEach( (item, i) => {
    		lista[i].barra = precio.indexOf(item.precio); 
    	});

		ordenarFecha = Object.assign([], lista.sort( (a,b) => {
			return Date.parse('01/01/2013 '+a.fecha) - Date.parse('01/01/2013 '+b.fecha)
		}));

    	this.setState({
    		currency: this.state.currency,
    		filtroValor: filtro,
    		data: ordenarFecha,
    		show: true,
    		precio: precio,
    		loading: false
    	});
    });

}


show = (e) => {
  	
    	this.setState({
    		currency: e.target.value,
    		loading: true,
    		show: false
    	});

    const data = Api.get.currency('mes', e.target.value);
    this.ordenarMes(data, 'mes', e.target.value);

  } 

  filtro = (e) => {

    	this.setState({
    		loading: true,
    		show: false
    	});

    const data = Api.get.currency(e.target.value, this.state.currency);   
    if (e.target.value == 'mes') {
    	this.ordenarMes(data, e.target.value, this.state.currency);
    } else if (e.target.value == 'hora') {
    	this.ordenarHora(data, e.target.value, this.state.currency);
    }


  } 

  render() {
    return (
      <div className="container">
	  	<Nav show={this.show} />

	  	{ this.state.loading &&
	  		<h1>cargando</h1>
	  	}
	  	{ 
	  		this.state.show &&
	  		<Graficos 
	  			filtro={this.filtro} 
	  			filtroValor={this.state.filtroValor}
	  			data={this.state.data}
	  			precio={this.state.precio} />
	  	}

      </div>
    );
  }
}


export default App;
