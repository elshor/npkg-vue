/*
 *   Copyright (c) 2021 DSAS Holdings LTD.
 *   All rights reserved.
 */

/** Returns true if the components are displayed in edit mode */
export function isDevMode(){
	return window && window.__naturaEdit && __naturaEdit.devMode;
}

/** Set this class when clicking on the element with this class should open the editor  */
export const EDIT_CLASS = 'natura-edit';

export function overrideData(baseData,props={},style={},classText=''){
	const ret = {};
	ret.props = Object.assign({},baseData.props,props);
	ret.class = ((baseData.class||'') + ' ' + classText);
	ret.style = Object.assign({},baseData.style,style);
	ret.attrs = baseData.attrs;
	ret.on = baseData.on;
	ret.scopedSlots = baseData.scopedSlots;
	ret.slot = baseData.slot;
	ret.key = baseData.key;
	ret.ref = baseData.ref;
	ret.refInFor = baseData.refInFor;
	return ret;
}

export function getPathInScript(path){
	let current = __natura.script;
	const steps = path.split('/');
	for(let i=0;i<steps.length;++i){
		if(steps[i]===''){
			//empty string - skip
			continue;
		}
		current = current[steps[i]];
	}
	return current;
}