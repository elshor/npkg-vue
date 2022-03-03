/*
 *   Copyright (c) 2021 DSAS Holdings LTD.
 *   All rights reserved.
 */
import placeholder from '../placeholder';

/**
 * 
 * @typedef PlaceholderOptions
 * @prop {String=} defaultRef default name to use to reference the parent component. E.g. `the row`
 * @prop {String=} tooltip tooltip to display. Overrides defaultRef value
 */

/**
 * @typedef RenderHandlers
 * @prop {Function} [renderChildren] render additional children. The method takes two arguments: createElement function and data
 * @prop {Function} [overrideProps]
 * @prop {Function} [overrideOn]
 * @prop {Function|Object|string} [overrideStyle] can be a function returning style object, an override style object or style string
 */

/**
 * Returns a mixin component with render function. 
* @param {Object} extending a component to extend
* @param {RenderHandlers} handlers handlers for customizing render function
* @param {PlaceholderOptions=} placeholderOptions
* @returns {Component}
*/
export function renderExtended(instanceOrContext,h,extending,handlers,placeholderOptions){
	const data = instanceOrContext.$vnode?instanceOrContext.$vnode.data : instanceOrContext.data;
	const slots = instanceOrContext.$slots || instanceOrContext.slots || {};
	const props = data.props;
	const on = data.on || instanceOrContext.$listeners || {};
	const style = data.style || {};
	const calculatedProps = handlers.overrideProps?
		handlers.overrideProps.call(instanceOrContext,props):{};
	const calculatedOn = handlers.overrideOn?
		handlers.overrideOn.call(instanceOrContext):{};
	const calculatedStyle = overrideStyle(instanceOrContext,handlers,style);
	const computedData = Object.assign(
		{},
		propertiesOf(data,['attrs','class','ref','domProps','nativeOn','directives','scopedSlots','slot','key','refInFor']),{
		props:Object.assign({},props,calculatedProps),
		on:Object.assign({},on,calculatedOn),
		style:Object.assign({},style,calculatedStyle)
	});
	const callerChildren = 
		handlers.renderChildren? 
			handlers.renderChildren.call(instanceOrContext,h,instanceOrContext) : 
			[];
	const children = [...callerChildren,...slots.default||[]];
	if(placeholderOptions){
		children.push(renderPlaceholder(computedData,h,placeholderOptions));
	}
	const vnode = h(extending,computedData,children)
	return vnode;
}

function renderPlaceholder(data,h,options){
	const {defaultRef,tooltip} = options;
	return h(
		placeholder,
		{
			props:{
				naturaPath:data.props.naturaPath+'/children/-1',
				container:data.props.nref || defaultRef,
				tooltip
			}
		}
	)
}

function overrideStyle(instanceOrContext,handlers,style){
	if(handlers && handlers.overrideStyle){
		if(typeof handlers.overrideStyle === 'function'){
			return handlers.overrideStyle.call(instanceOrContext,style);
		}else if(typeof handlers.overrideStyle === 'object'){
			return Object.assign({},style,handlers.overrideStyle);
		}else if(typeof handlers.overrideStyle === 'string'){
			return Object.assign(
				{},
				style,
				Object.fromEntries(
				handlers.overrideStyle
					.split(';')
					.map(item=>item.trim())
					.map(item=>{
						const matched = item.match(/^([\w\-]+)\s?\:(.*)$/);
						return matched? [matched[1],matched[2]] : [item,true];
					})
				)
			)
		}else{
			throw new Error('Unknown override style specification');
		}
	}else{
		return style;
	}
}

function propertiesOf(obj,list){
	return Object.fromEntries(Object.entries(obj).filter(([key,_])=>list.includes(key)))
}