/*
 *   Copyright (c) 2022 DSAS Holdings LTD.
 *   All rights reserved.
 */
import { h } from "vue"

/**
 * A page integrated into an app using the router
 * @natura component page with path <<path>>
 * @props {String} path
 * @title page
 * @children {PageContent[]} pageContent (expanded)

 */
export const Page = {
	created(){
	},
	name: 'page',
	render(){
		return h('div',this.$slots.default());
	}
}