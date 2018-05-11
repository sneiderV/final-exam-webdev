import React, { Component } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3"; 

class scheduleGraph extends Component{
	constructor(props) {
		super(props);
		this.margin = {top: 10, right: 10, bottom: 10, left: 10};
	}

	componentDidMount(){
		console.log(">> ESTOS SON LOS DATOS DESDE EL COMPONENETE DE GRAFICO:");
		console.log(this.props);

		const svg = d3.select(this.svg);
		this.width = +svg.attr("width");
		this.height = +svg.attr("height");

	}

		render() {
		return (
			<div> 
			<svg width="1100" 
			height="550" 
			ref = {(svg) => this.svg = svg}>
			</svg>


			</div> 
			); 
	}
}

scheduleGraph.propTypes = {
	buses: PropTypes.array.isRequired
};

export default(scheduleGraph);