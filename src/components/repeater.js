/*
 *   Copyright (c) 2021 DSAS Holdings LTD.
 *   All rights reserved.
 */

import { isDevMode } from "../utils";
import listMixin from "../mixins/list-mixin"

/**
 * Repeat a block for each item in a collection.
 * @natura component
 * @data {DataQuery} collection data collection for the repeater. A block is generated for each data collection item(suggest expressions)
 * @data {type.Component} repeatComponent the component to repeat for each data item(title:repeat component;context:{$location.parent.properties.collection.valueSpec.$specialized.dataType} "{{$location.parent.parent.value.$id}}-item" ({{the $location.parent.properties.collection.valueSpec.$specialized.dataType}}))
 */
export const Repeater = {
	name:'repeater',
	mixins:[listMixin],
	props:['collection','repeatComponent'],
	render(h){
		const {attrs,props,on,style} = this.$vnode.data;
		const data = {attrs,props,on,style};
		data.class = this.$vnode.data.class;
		return h(
			'div',
			data,
			(isDevMode() && (!this.collection || !this.repeatComponent))?
				'Edit repeater collection and repeat component in editor' :
				this.renderList(
					h, //render function
					this.collection,//the collection
					this.repeatComponent,//repeated component
					{itemAccess:this.$vnode.data._sid+'-item'}
			)
		);
	}
}