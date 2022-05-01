/*
 *   Copyright (c) 2022 DSAS Holdings LTD.
 *   All rights reserved.
 */
import { h } from "vue"

/**
 * A page integrated into an app using the router
 * @natura component page <<props/name>>
 * @prop {String} path
 * @props {String} name
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