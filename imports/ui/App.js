import React, { Component } from "react";
import PropTypes from "prop-types";

import "../api/remoteReq.js"
import TopUI from "./TopUI.js";
import * as d3 from "d3";
import ReactDOM from 'react-dom';


import AccountsUIWrapper from './AccountsUIWrapper.js';
import { withTracker } from 'meteor/react-meteor-data';
import { Comentarios } from '../api/comentarios.js'
class App extends Component{
	
	constructor(props){
		super(props);
		this.state={
			agencias:[],
			datosSchedule: {}
		};
	}

	cargarData(){

		Meteor.call("agencyList",(err,res) => {
            if(err) throw err;
            console.log(res.data.agency);
            this.setState({
                agencias : res.data.agency
            })
        }); 
	}

	listaAgencias(){
		Meteor.call("agencyList", (err,res) => {
			if(err) throw err;
			console.log(">> LISTA DE AGENCIAS");
			console.log(res.data.agency);
		})
	}

	cargarRutasAgencia(tagAgency){
		tagAgency = "actransit";
		Meteor.call("routeList",tagAgency,(err,res) => {
            if(err) throw err;
            console.log(">> RUTAS DE LA AGENCIA: "+tagAgency);
            console.log(res.data.route);
        }); 
	}

	infoRutaAgencia(tagAgency,tagRoute){
		tagAgency = "actransit";
		tagRoute = "BSD"
		Meteor.call("routeConfig",tagAgency,tagRoute,(err,res) => {
            if(err) throw err;
            console.log(">> RUTA "+tagRoute+" DE LA AGENCIA: "+tagAgency);
            console.log(res.data.route);
        }); 
	}

	prediccion(tagAgency,stopId){
		tagAgency = "actransit";
		stopId = "55222";
		Meteor.call("predictions",tagAgency,stopId,(err,res) => {
            if(err) throw err;
            console.log(">> PREDICCION PARA EL PARADERO "+stopId+" DE LA AGENCIA: "+tagAgency);
            console.log(res.data.predictions);
        }); 
	}

	schedule(tagAgency,tagRoute){
		Meteor.call("schedule",tagAgency,tagRoute,(err,res) => {
            if(err) throw err;
            console.log(">> SCHEDULE PARA LA TURA "+tagRoute+" DE LA AGENCIA: "+tagAgency);
            console.log(res);
            this.setState({
            	datosSchedule : res.data.route[0]
            });
        }); 
        // console.log("datos en el estado");
        // console.log(this.datosSchedule);
	}

	docuJhon(){
		
    fetch("https://gist.githubusercontent.com/john-guerra/6a1716d792a20b029392501a5448479b/raw/e0cf741c90a756adeec848f245ec539e0d0cd629/sfNSchedule")
      .then(response => response.json())
      .then(data => {
      	this.setState({ 
      		datosJhon: data.route[2].tr[2].stop
      	})
      	console.log(">> DATOS QUE SE DEBEN MOSTRAR")
      	console.log(data.route[2].tr[2].stop);
      });

  //     return this.state.datosJhon.map((d) => {
		// 	return(
		// 		//<div key={d.epochTime}>
		// 			<p key={d.epochTime}> {d.tag} </p>
		// 		//</div>
		// 		);
		// });
}

	renderAgencias(){
		//siempre existe el state agencias por que lo creo desde que monto el componente
		return this.state.agencias.map((m) => {
			return(
				//<div key={m.tag}>
					<p key={m.tag}>{m.title}</p>
				//</div>
				);
		});
	}

	renderBuses(){
		if(!this.state.datosSchedule.tr)
			return <p>Cargando...</p>;
		let buses = []

		this.state.datosSchedule.tr.forEach((bus)=>{
			let route = bus.stop.filter((d) => d.content!=="--");
			route.forEach((d) => d.date = new Date(+d.epochTime));    
			buses.push(route);
		});

		// console.log("buses",buses);

		// Estoy haciendo el map para un solo bus
		// return buses[1].map((busStop)=>{
		// 	return (<div key={busStop.tag}>{busStop.tag}</div>);
		// });
		this.dibujar(buses);

	}

	//metodo para pintar el arreglo _schedule_ del estado 
	dibujar(buses){
		const datosSchedule = this.state.datosSchedule;
		const svg = d3.select("#svg");
		console.log("svg",svg);
		const margin = ({top: 20, right: 30, bottom: 30, left: 150});
		const height = svg.attr("height") - margin.top - margin.bottom;
		const width = svg.attr("width") - margin.left - margin.right;

		const minDate = d3.min(buses[1], d => d.date);
	  	const maxDate = new Date(minDate.getTime() + 22*60*60*1000); // minDate + 24 hours

	  const x = d3.scaleTime()
	  	.domain([ minDate, maxDate ])
	  	.range([margin.left, width - margin.right]);
	  
	  const y = d3.scaleBand()
	  	.domain(d3.range(buses[1].length))
	  	.rangeRound([height - margin.bottom, margin.top]);
	  
	  const xAxis = g => g
	  .attr("transform", `translate(0,${height - margin.bottom})`)
	  .call(d3.axisBottom(x))
	  
	  const yAxis = g => g
	  	.attr("transform", `translate(${margin.left},0)`)
	  	.call(d3.axisLeft(y)
	  		.tickFormat((d) => datosSchedule.header.stop[d].content));  

	  const line = d3.line()
	  	.x(d => x(d.date))
	  	.y((d,i) => y(i) + y.bandwidth()/2);

	  svg.append("g")
	  .call(xAxis);

	  svg.append("g")
	  .call(yAxis);
	  
	  svg.selectAll(".routes")
	  .data(buses)
	  .enter()
	  .append("path")
	  .attr("fill", "none")
	  .attr("stroke", "steelblue")
	  .attr("stroke-width", 2)
	  .attr("stroke-linejoin", "round")
	  .attr("stroke-linecap", "round")
	  .attr("d", line);
	  return svg.node(); 
	}

	//manejo los eventos del input
	handleSubmit(event) {
    event.preventDefault();
 
    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
 	const owner = this.props.currentUser.username;
    Comentarios.insert({
      text,
      owner,
      createdAt: new Date(), // current time
    });
 
    // Clear form despues de hacer Enter
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  renderComentarios(){
  	//filtro los comentarios
  	let filterComentarios = this.props.comentarios;

  	 return filterComentarios.map((com) => {
      console.log(">> este es mi comentario");
      console.log(com);
      const currentUser = this.props.currentUser;
      console.log(">>Este es mi currente user: "+currentUser.username);
      return (
      	<div key={com._id} >
      		<p key={com._id}> Comentario de: {com.owner} </p>
        	<p key={com._id}> Comentario: {com.text} </p>
      	</div>
      );
    });
  }

	//se ejecuta apenas se carge el componente de react
	componentDidMount(){

		let tagAgency = "sf-muni";
		let tagRoute = "N";
		this.schedule(tagAgency,tagRoute);
	}
	
	// {this.xxxxx()}
   	render(){
		//llamo las datos en el segundo render
		this.renderBuses();		
		
		return( 
		<div className="App">
			<TopUI/>
			<AccountsUIWrapper />
			<h3>App component React!</h3>
			<button onClick={this.docuJhon.bind(this)}>Agencias</button>	
			<svg 
			id ="svg"
			width="1280" 
			height="500" 
			ref = {this.svg}
			></svg>

			<form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
            <input type="text" ref="textInput" placeholder="Escribe un nuevo comentario y presiona Enter!" width="100"/>
            </form>

            <ul>
          		{this.renderComentarios()}
        	</ul>

			<h1>fin component react</h1>
		</div>);
	}
}

App.propTypes={

};

//export default App;
export default withTracker(() => {
  return {
    comentarios: Comentarios.find({}, { sort: { createdAt: -1 } }).fetch(),
    currentUser: Meteor.user(),
  };
})(App);