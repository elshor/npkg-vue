/*
 *   Copyright (c) 2022 DSAS Holdings LTD.
 *   All rights reserved.
 */
import { h } from "vue"
import { Placeholder } from "./placeholder"

/**
 * A plain page integrated into the app using the router
 * @natura component page <<ref>>
 * @prop {String} path
 * @isa page
 * @title page
 * @children {PageContent[]} pageContent (expanded)

 */
export const PlainPage = {
	created(){
	},
	name: 'page',
	render(){
		const placeholder = h(Placeholder,{
			naturaPath: this.naturaPath + '/children/-1',
			tooltip:'Insert component into the page'
		})
		return h(
			'div',[
				...typeof this.$slots.default === 'function'?this.$slots.default() : [],
				placeholder
			]
		);
	}
}