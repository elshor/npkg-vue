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

export function overrideData2(baseData,override){
	const ret = {};
	ret.props = Object.assign({},baseData.props,override.props);
	ret.class = ((baseData.class||'') + ' ' + override.class);
	ret.style = Object.assign({},baseData.style,override.style);
	ret.attrs = Object.assign({},baseData.attrs,override.attrs);
	ret.on = Object.assign({},baseData.on,override.on);
	ret.scopedSlots = Object.assign({},baseData.scopedSlots,override.scopedSlots);
	ret.slot = override.slot||baseData.slot;
	ret.key = override.key || baseData.key;
	ret.ref = override.ref || baseData.ref;
	ret.refInFor = override.refInFor || baseData.refInFor;
	ret.model = override.model || baseData.override;
	return ret;
}