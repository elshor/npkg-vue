/*
 *   Copyright (c) 2022 DSAS Holdings LTD.
 *   All rights reserved.
 */
import {h} from 'vue'
import { fnComponent } from "./fn-component";
import { getPathInScript } from './utils';
export default function generateComponent(spec,path){
	return {
		name: spec.name || spec.ref,
		mounted(){
			//need to update view after mounted so components that reference other componets will be able to retreive the component object. In first round, the $root.$refs is still empty
			const vm = this;
			this.$nextTick(()=>vm.$forceUpdate());
		},
		data(){
			const vm = this;
			return {
				generatedRenderFunction: fnComponent(spec,path),
				context:{$root:vm}
			}
		},
		render(){
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
				//whenver edit count changes, rerender
				this.updateTime = new Date().toISOString();
				this.generatedRenderFunction = fnComponent(getPathInScript(path),path);
				this.$forceUpdate();
			},
		}	
	}
}

