import React, { Component } from 'react';

class GraficoHora extends Component {

  render() {

  	let ejey = [];
  	let ejex = [];
  	let barras = [];

    	this.props.data.forEach( (item, i) => {
    		ejex[i] = <span key={i} >{item.fecha}</span>;
    		barras[i] = <div key={i} data-valor={item.barra} className='barra' ></div>;
    	});

    	this.props.precio.forEach( (item, i) => {
    		ejey[i] = <li key={i} data-ejey={item}></li>;
    	});    	

    	ejey.reverse();

    return (
	    <div className="contenedor-grafico">
	       <div className='grafico'>
	       	<div className='caja-barras' >
	       		<div className='barras' >
		       		{ 
		       			barras.map( (item) =>{
		       				return item;
		       			})
		       		}
		       		</div>
	        	
		       <ul className='eje-y'>
		       		{ 
		       			ejey.map( (item) =>{
		       				return item;
		       			})
		       		}
		       </ul>
		    </div>
	       <div className='eje-x'>
		       		{ 
		       			ejex.map( (item) =>{
		       				return item;
		       			})
		       		}
	       </div>   
	       </div>
	    </div>
    );
  }
}


export default GraficoHora;
