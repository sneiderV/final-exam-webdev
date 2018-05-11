import React, { Component } from "react";
import PropTypes from "prop-types";

import "../api/remoteReq.js"
import TopUI from "./TopUI.js";

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
		
    fetch("https://gist.githubusercontent.com/john-guerra/a0b840ba721ed771dd02d94a855cb595/raw/d68dba41f118bebc438a4f7ade9d27078efdfc09/sfBuses.json")
      .then(response => response.json())
      .then(data => {
      	this.setState({ datosJhon: data.vehicle})
      	console.log(data.vehicle)
      });

      return this.state.datosJhon.map((d) => {
			return(
				//<div key={m.tag}>
					<p key={d.id}> {d.routeTag} </p>
				//</div>
				);
		});

}

//no sé porque me sale _data_ = null
doc2JhonServer(){

			Meteor.call("docJohn",(err,res) => {
            if(err) throw err;
            console.log(">> DATOS DE JHON ");
            console.log(res);
        });
}


	
	//se ejecuta apenas se carge el componente de react
	// componentDidMount(){
	// 	Meteor.call("agencyList",(err,res) => {
	// 		if(err) throw err;
	// 		console.log(res.data.agency);
	// 		this.setState({
	// 			agencias : res.data.agency
	// 		})
	// 	});	
	
	// }

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
			<button onClick={this.cargarData.bind(this)}>Agencias</button>			

			{this.docuJhon()}
		</div>);
	}
}

App.propTypes={

};

export default App;