/*
 *   Copyright (c) 2022 DSAS Holdings LTD.
 *   All rights reserved.
 */
/**
 * 
 * @param {*} spec 
 * @param {*} elementOrId 
 * @param {*} parentData 
 * @param {*} index 
 */
export function getRenderInputFromScript(spec,npath){
	if(!spec){
		return undefined;
	}
	const entry = getLibEntry(spec)
	const comp = entry.value;
	if(!comp){
		console.error('component',spec.$type,'does not have an object defined in code. This is probably a problem with the package containing the component','\n',JSON.stringify(entry));
	}
	const data = getData(spec,npath);

	//check if there is a condition for display
	const condition = spec && spec.display && spec.display.displayCondition? 
		fn(spec.display.displayCondition,true) :
		undefined;
	
		//check for npath
	if(npath){
		data.props.push({
			key:'naturaPath',
			value:npath
		})
	}
	
	const children = (asArray(spec.children)).map((child,index)=>
		getRenderInputFromScript(child,(npath||'')+'/children/'+index)
	);
	
	const usedSlots = processSlots(data,entry,children,npath)
	return {comp,data,children,condition,entry,spec,usedSlots};
}

function getLibEntry(spec){
	const type = spec.$type;
	if(type && window.__natura && __natura.lib && __natura.lib[type]){
		return __natura.lib[type];
	}else{
		console.error('Could not find component object for',type);
		return {};
	}
}

/**
 * Given a component spec, return a data object later used to generate the data for createElement function. The spec is the script object describing the component instance
 * @param {*} spec 
 */
 function getData(spec,npath){
	const ref = spec.ref;
	
	const props = Object.entries(spec.props||{}).map(
		entry=>dataEntry(entry,(npath||'')+'/props'));
	const display = Object.entries(spec.display||{})
		.filter(([key])=>key!=='ref')//ignore ref property
		.map(entry=>dataEntry(entry,(npath||'')+'/display'));
	const style = (spec.style||[]).map(entry=>styleEntry(entry));
	const attrs = Object.entries(spec.attrs||{}).map(dataEntry);
	const on = Object.entries(spec.on||{}).map(entry=>dataEntry(entry,null,true));
	const classes = (spec.classes||[]).map((item,index)=>dataEntry([index,item]));
	if(spec.$path){
		props.push({key:'naturaPath',value:spec.$path});
	}
	if(ref){
		props.push({key:'nref',value:ref});
		attrs.push({key:'data-nref',value:ref});
	}
	attrs.push({key:'data-ntype',value:spec.$type||'component'});
	
	return {props:props.concat(display),style,ref,attrs,on,classes}
}

/**
 * A data entry is an object with key,value,fn that is used to generate in render time an object. If fn === value then the value is `value`. Otherwise, assume fn is a function calculating value
 */
 function dataEntry([key,value],npath,isCallback=false){
	return {
		key,
		value,
		fn:fn(value,(npath||'')+'/' + key,isCallback)
	}
}

function styleEntry(entry,npath){
	if(entry.$type){
		//this is a calculated value
		return {fn:__natura.fn(entry)}
	}
	if(entry.key !== undefined){
		//this was generated using value tag in natura properties
		return {
			key:entry.key,
			fn:entry.value?__natura.fn(entry.value) : undefined
		}
	}
	return {};//entry not understood
}

function processSlots(data,entry,children,npath){
	const ret = [];
	if(!entry || !entry.options || !entry.options.slots){
		return ret;
	}
	const slots = entry.options.slots;
	data.props = data.props.filter(({key,value})=>{
		const slotEntry = slots[key];
		if(!slotEntry){
			//this prop is not a slot
			return true;
		}
		ret.push(slotEntry.name);
		const element = getRenderInputFromScript(value,npath? (npath+'/props/'+key):null);
		if(element){
			element.data.slot = slotEntry.name || 'default';
			children.push(... asArray(element));
		}
	});
	return ret;
}

function fn(spec,npath,isCallback){
	const ret = __natura.fn(spec,isCallback?['event']:undefined);
	if(ret && ret.componentWrapper){
		return fnComponent(ret.def,npath);
	}else{
		return ret;
	}
}

function asArray(input){
	if(input === undefined){
		return [];
	}
	if(Array.isArray(input)){
		return input;
	}else{
		return [input];
	}
}
