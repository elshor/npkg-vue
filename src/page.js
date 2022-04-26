/*
 *   Copyright (c) 2022 DSAS Holdings LTD.
 *   All rights reserved.
 */
import { h } from "vue"

/**
 * A page integrated into an app using the router
 * @natura component page with path <<props/path>>
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
		return h('div',this.$slots.default());
	}
}