/*
 *   Copyright (c) 2022 DSAS Holdings LTD.
 *   All rights reserved.
 */
export default function callPlugin(name,...args){
	(window.__natura.plugins||[]).forEach(plugin=>{
		if(typeof plugin[name] === 'function'){
			plugin[name].call(this,...args);
		}
	});

}