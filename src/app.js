/*
 *   Copyright (c) 2021 DSAS Holdings LTD.
 *   All rights reserved.
 */
import Vue from 'vue'
import globalMixin from './global-mixin';
import { fnComponent } from './fn-component';
import './placeholder';
import './style/placeholder.css'
export * from 'npkg-core';
window.vue = Vue;
window.Vue = Vue;
let mountedVueInstance = null;
/**
 * Dynamic component represents a reactive component
 * @typedef DynamicComponent
 * @prop {Component[]} children (role:type)
 * @natura entity
 */

/**
* Provide a front end script that is dynamiclly rendered on the client
* @natura action
* @param {String} name script name(group:info)
* @param {Richtext} description description of this script (group:info)
* @param {NaturaDataDefinition} data define the data entities to use in the app. These entities will be stored in the database(expanded)
* @param {Component} component component (readonly;expanded;title:view)
* @param {String[]} packages packages to use - list of packages to use in this script. Each package encapsulates some functionality. This is similar to npm packages
* @param {AppExtension[]} extensions Extensions add functionality to the web application (role:type)
* @additional packages
* @display tabs
* @show info,data,component,extensions
* @useContext data
**/
export function FrontEndScript(name,description,component,packages,data,extensions){
	if(document.readyState !== 'loading'){
		const element =  
			document.querySelector('#app')||
			document.querySelector('[data-npath="/component"]');
		if(element){
			mountVue(element,__natura.script.component);
		}else{
			console.error('Could not find element to mount.');
		}
		initExtensions(extensions);
	}else{
		window.addEventListener('DOMContentLoaded', () => {
		//if in edit mode then add scan function so editor can initiate scanning for components
		const element = document.querySelector('#app')||
			document.querySelector('[data-npath="/component"]');
		mountVue(element,__natura.script.component);
		initExtensions(extensions);
		});	
	}
}

function mountVue(element,script){
	ensureNatuarEditObservable();
	if(mountedVueInstance){
		//already mounted - no need to mount again
		return;
	}
	const options = {
		mounted(){
			//need to update view after mounted so components that reference other componets will be able to retreive the component object. In first round, the $root.$refs is still empty
			const vm = this;
			this.$nextTick(()=>vm.$forceUpdate());
		},
		data(){
			const vm = this;
			return {
				generatedRenderFunction: fnComponent(script,'/component'),
				context:{$root:vm}
			}
		},
		render(h){
			if(this.generatedRenderFunction){
				// @ts-ignore
				return this.generatedRenderFunction.call(this.context,h);
			}
		},
		computed:{
			editId(){
				return window.__naturaEdit? __naturaEdit.count : 0;
			}
		},
		watch:{
			editId(_id){
				this.generatedRenderFunction = fnComponent(__natura.script.component,'/component');
				this.$forceUpdate();
			},
		}	
	};
	
	//look for plugins
	(window.__naturaPlugins||[]).forEach(plugin=>{
		if(typeof plugin.initMountedVue === 'function'){
			plugin.initMountedVue(options);
		}
	});
	
	mountedVueInstance = new Vue(options);
	mountedVueInstance.$mount(element)
}

//register global vue mixin to manage connection with editor
Vue.mixin(globalMixin)

//make naturaEdit observable
function ensureNatuarEditObservable(){
	if(window.__naturaEdit){
		window.__naturaEdit = Vue.observable(__naturaEdit)
	}
}

/**
 * Call init function of all extensions
 * @param {AppExtension[]} extensions extensions to initialize
 */
function initExtensions(extensions=[]){
	extensions.forEach(ext=>{
		if(typeof ext.init === 'function'){
			ext.init();
		}
	})
}
