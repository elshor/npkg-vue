/*
 *   Copyright (c) 2022 DSAS Holdings LTD.
 *   All rights reserved.
 */
import { h } from "vue"

/**
 * A text span element that can be used for display of text.
 * @natura component <<props/text>>
 * @title text span
 * @prop {String} text (placeholder:text to display)

 */
export const SpanText = {
	name: 'span-text',
	props:['text'],
	render(){
		return h('span',this.text);
	}
}
