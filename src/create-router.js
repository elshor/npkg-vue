/*
 *   Copyright (c) 2022 DSAS Holdings LTD.
 *   All rights reserved.
 */
import { h, watch } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router'
import generateComponent from './generate-component';
import { getPathInScript, isDevMode } from './utils';
import { Placeholder } from './components/placeholder';

function PagePlaceholder(page,naturaPath,routerHolder){
	return {
		name: 'n-page-placeholder',
		render(){
			return [
				h(Placeholder,{
					tooltip:'add a sub-page',
					menuTitle:'Page to add',
					barText:'Add Page',
					naturaPath,
					afterAdd(value){
						if(routerHolder.router){
							routerHolder.updater();
							setTimeout(()=>routerHolder.router.push({name:value.$id}),100)
						}
					}
				}),
				h(page)
			];
		}
	}
}

export default function (topComponent, spec,path){
	const routerHolder = {
		router:null
	}
	routerHolder.router = createRouter({
		history: createWebHashHistory(),
		routes:[
			routeEntry(path,{component:topComponent,path,routerHolder})
		]
	})
	const updater = updateRouter.bind(this,routerHolder,path,topComponent);
	routerHolder.updater = updater;
	watch(isDevMode,updater);
	return routerHolder;
}

function updateRouter(routerHolder,path,topComponent){
	const router = routerHolder.router;
	const newRoute = routeEntry(path,{component:topComponent,path,routerHolder});
	const currentRoute = router.currentRoute.value;
	router.addRoute(newRoute);
	router.replace(currentRoute);
}

function routeEntry(naturaPath,{component,name,path,routerHolder}={}){
	const spec = getPathInScript(naturaPath);
	const children = [];
	(spec.subPages||[]).forEach((page,index)=>{
		const childNpath = naturaPath+'subPages/'+index;
		const childComponent = isDevMode()? 
			PagePlaceholder(generateComponent(page,childNpath),naturaPath + 'subPages/-1',routerHolder):
			generateComponent(page,naturaPath+'subPages/'+index);
		children.push(
			routeEntry(naturaPath+'subPages/'+index, {component:childComponent,routerHolder}),
			routeEntry(naturaPath+'subPages/'+index, {component:childComponent,name:page.$id,path:page.$id,routerHolder}),
		)
	})
	return {
		name: name || calcName(spec),
		path: path || calcPath(spec),
		props:{
			naturaPath,
			naturaIsPage:true
		},
		component: component || generateComponent(spec,naturaPath),
		children
	}
}

function calcPath(spec){
	if(spec.props && spec.props.path){
		return spec.props.path;
	}else if(spec.path){
		return spec.path;
	}else if(spec.name === 'default'){
		return '';
	}else{
		return spec.name || '';
	}
}

function calcName(spec){
	if(spec.props && spec.props.name){
		return spec.props.name;
	}else{
		return spec.name || spec.ref || ''
	}
}
