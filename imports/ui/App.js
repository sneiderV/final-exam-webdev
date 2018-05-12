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
			datosSchedule: {},
			tagAgency : "sf-muni",
			tagRoute : "N",
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

	//datos que se piden al API para mostrar la grafica
	schedule(tagAgency,tagRoute){
		Meteor.call("schedule",tagAgency,tagRoute,(err,res) => {
            if(err) throw err;
            console.log(">> SCHEDULE PARA LA TURA "+tagRoute+" DE LA AGENCIA: "+tagAgency);
            console.log(res);
            this.setState({
            	datosSchedule : res.data.route[0]
            });
        }); 
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

	renderSchedule(){
		if(!this.state.datosSchedule.tr)
			return <p>Cargando...</p>;
		let buses = [];

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
		this.pintarSchedule(buses);

	}

	//metodo para pintar el arreglo _schedule_ del estado 
	pintarSchedule(buses){
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

	//manejo los eventos del input del search
	handleSearch(event) {
		event.preventDefault();
		const tagA = ReactDOM.findDOMNode(this.refs.tagA).value;
		const tagR = ReactDOM.findDOMNode(this.refs.tagR).value;
		
	    console.log("tag a: "+tagA+"tag r: "+tagR);
	    this.renderComentarios();
	    this.setState({ 
      		tagAgency: tagA,
      		tagRoute: tagR,
      	})
      	console.log("estados nuevos:"+this.state.tagAgencia);
	    d3.selectAll("svg > *").remove();
	    this.schedule(tagA,tagR);
	}

	//manejo los eventos del input del comentario
	handleSubmit(event) {
    event.preventDefault();
 
    if(Meteor.user()){
	    // Find the text field via the React ref
	    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
	 	const owner = this.props.currentUser.username;
	    Comentarios.insert({
	      text,
	      owner,
	      createdAt: new Date(), // current time
	      tagAgencia : this.state.tagAgency,
	      tagRuta : this.state.tagRoute,
	    });
	    // Clear form despues de hacer Enter
	    ReactDOM.findDOMNode(this.refs.textInput).value = '';
	 }
	 else{
	 	alert("Porfavor hacer SignIn");
	 }
  }

  renderComentarios(){
  	//filtro los comentarios
  	let filterComentarios = this.props.comentarios;
console.log(">>>> comentarios");
console.log(filterComentarios);
  	 let filterTags = filterComentarios.filter((c) => {return (c.tagAgencia).includes("ac")});
console.log(">>>> comentarios con filtrooooo: ");
console.log(filterTags);

  	 //return filterComentarios.map((com) => {
  	 return filterTags.map((com) => {	
      console.log(">> este es mi comentario");
      console.log(com);
      // const currentUser = this.props.currentUser;
      // console.log(">>Este es mi currente user: "+currentUser.username);
      return (
      	//<div key={com._id} >
      		<p key={com._id}> Comentario de: {com.owner} >> {com.text}</p>
      	//</div>
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
		this.renderSchedule();		
		
		return( 
		<div className="App">
			<TopUI/>
			<AccountsUIWrapper />
			<h3>App component React!</h3>
			<button onClick={this.docuJhon.bind(this)}>Agencias</button>	
			
			<form >
			  <div className="row">
			  <div className="col-auto"> <label>Agencia</label> </div>
			  <div className="col-auto">
			     <select id="inputState" ref="tagA" className="form-control">
					<option defaultValue>Escoje...</option>
					<option>actransit</option> <option>jhu-apl</option> <option>art</option> <option>atlanta-sc</option>
					<option>bigbluebus</option> <option>brockton</option> <option>camarillo</option> <option>ccrta</option>
					<option>chapel-hill</option> <option>charm-city</option> <option>ccny</option> <option>oxford-ms</option>
					<option>west-hollywood</option> <option>configdev</option> <option>cyride</option> <option>dc-circulator</option>
					<option>dc-streetcar</option> <option>da</option> <option>dta</option> <option>dumbarton</option>
					<option>charles-river</option> <option>ecu</option> <option>escalon</option> <option>fast</option>
					<option>fairfax</option> <option>ft-worth</option> <option>glendale</option> <option>south-coast</option>
					<option>indianapolis-air</option> <option>jfk</option> <option>jtafla</option> <option>laguardia</option>
					<option>portland-sc</option> <option>lametro</option> <option>lametro-rail</option> <option>mbta</option>
					<option>mit</option> <option>moorpark</option> <option>ewr</option> <option>nova-se</option>
					<option>omnitrans</option> <option>pvpta</option> <option>sria</option> <option>psu</option>
					<option>portland-sc</option> <option>pgc</option> <option>reno</option> <option>radford</option>
					<option>roosevelt</option> <option>rutgers-newark</option> <option>rutgers</option> <option>sf-muni</option>
					<option>seattle-sc</option> <option>simi-valley</option> <option>stl</option> <option>sct</option>
					<option>geg</option> <option>tahoe</option> <option>thousand-oaks</option> <option>ttc</option>
					<option>unitrans</option> <option>ucb</option> <option>ucsf</option> <option>umd</option>
					<option>vista</option> <option>wku</option> <option>winston-salem</option> <option>york-pa</option>
				 </select>
			  </div>
			  <div className="col-auto"> <label>Ruta</label> </div>
			  <div className="col-auto"> <input type="text" className="form-control mb-2" ref="tagR" placeholder="TAG Ruta"/>	</div>
              <button type="submit" className="btn btn-primary"  onClick={this.handleSearch.bind(this)}>Buscar</button>
			  </div>
			</form>

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