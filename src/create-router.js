/*
 *   Copyright (c) 2022 DSAS Holdings LTD.
 *   All rights reserved.
 */
import { createRouter, createWebHashHistory } from 'vue-router'
import generateComponent from './generate-component';

export default function (topComponent, spec,path){
	const router = createRouter({
		history: createWebHashHistory(),
		routes:[
			routeEntry(path,spec,{component:topComponent,path})
		]
	})
	return router;
}

function routeEntry(naturaPath,spec,{component,name,path}={}){
	return {
		name: name || calcName(spec),
		path: path || calcPath(spec),
		component: component || generateComponent(spec,naturaPath),
		children:(spec.subPages||[]).map((page,index)=>
			routeEntry(naturaPath+'/subPages/'+index,page)
		)
	}
}

function calcPath(spec){
	if(spec.props && spec.props.path){
		return spec.props.path;
	}else{
		return spec.path || spec.name || ''
	}
}

function calcName(spec){
	if(spec.props && spec.props.name){
		return spec.props.name;
	}else{
		return spec.name || spec.ref || ''
	}
}