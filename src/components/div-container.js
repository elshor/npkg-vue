/*
 *   Copyright (c) 2022 DSAS Holdings LTD.
 *   All rights reserved.
 */
import { h } from "vue"
import { Placeholder } from "./placeholder"

/**
 * A plain div element that can be used as a container for other components and elements.
 * @natura component
 * @title div container
 * @children {Component[]} content (expanded)
 * @isa page content
 */
export const DivContainer = {
	name: 'div-container',
	render(){
		const placeholder = h(Placeholder,{
			naturaPath: this.naturaPath + '/children/-1',
			tooltip:'Insert component into the div container'
		})
		return h(
			'div',[
				...typeof this.$slots.default === 'function'?this.$slots.default() : [],
				placeholder
			]
		);
	}
}
