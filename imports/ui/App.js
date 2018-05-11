import React, { Component } from "react";
import PropTypes from "prop-types";

import "../api/remoteReq.js"
import TopUI from "./TopUI.js";
import scheduleGraph from "./scheduleGraph.js";

class App extends Component{
	
	constructor(props){
		super(props);
		this.state={
			agencias:[],
			datosJhon : []
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

//no sé porque me sale _data_ = null lo hago con UNA FUNCION de meteor en el servidor
doc2JhonServer(){

			Meteor.call("docJohn",(err,res) => {
            if(err) throw err;
            console.log(">> DATOS DE JHON DESDE EL SERVER ");
            console.log(res);
            this.setState();
        });
}


	
	//se ejecuta apenas se carge el componente de react
	componentDidMount(){
		// Meteor.call("agencyList",(err,res) => {
		// 	if(err) throw err;
		// 	console.log(res.data.agency);
		// 	this.setState({
		// 		agencias : res.data.agency
		// 	})
		// });	
		
		// this.setState({
		// 	docuJhon : this.docuJhon()
		// });
		{this.docuJhon()}
	
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

	// {this.listaAgencias()}
	// {this.cargarRutasAgencia()}
	// {this.infoRutaAgencia()}
	// {this.prediccion()}

   	render(){
		return( 
		<div className="App">
			<TopUI/>
			<h3>App component React!</h3>
			<button onClick={this.docuJhon.bind(this)}>Agencias</button>			
			<scheduleGraph  buses = {this.state.datosJhon}> </scheduleGraph>
			
		</div>);
	}
}

App.propTypes={

};

export default App;