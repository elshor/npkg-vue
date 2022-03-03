/*
 *   Copyright (c) 2021 DSAS Holdings LTD.
 *   All rights reserved.
 */

import Vue from "vue";

//render a component for each item in data collection
export default { 
	methods:{
		getItemAccess(){
			return this.$vnode.data._sid+'-item';
		},
		prepareCollection(collection){
			this.collectionPrepared = true;
			const vm = this;
			const indexAccess = this.$vnode.data._sid+'-index';
			//collection is observable so any changes in collection will trigger render
			Vue.observable(collection);
			this.$watch(()=>{
				const ret = [];
				let index = 0;
				for(let x of (collection||[])){
					const context = Object.create(vm.naturaContext||{});
					Vue.observable(context);
					//add item to context so we can reference it
					Vue.set(context,this.getItemAccess(),x);
					Vue.set(context,indexAccess,index);
					ret.push(context);
					index++;
				}
				return ret;
			},
			newVal=>{
				vm.listContext = newVal;
				vm.$forceUpdate();
			},
			{immediate:true}
			);
		},
		/**
		 * 
		 * @param {Function} h createElement function
		 * @param {Component} render The repeat component to render
		 * @param {Object} overrideData Data to override
		 * @param {String} itemProp if set, pass the collection item to this property
		 */
		renderList(h,render,overrideData={},itemProp){
			if(!this.collectionPrepared){
				throw new Error('Calling renderList before collection was prepared');
			}
			if(typeof render === 'function'){
				return this.listContext.map((context,index)=>{
					const itemData = context[this.getItemAccess()];
					const key = itemData._id;
					const data = Object.assign({props:{}},overrideData,{refInFor:true,key:key||index});
					if(itemProp){
						data.props[itemProp] = itemData;
					}
					return render.call(
						context,
						h,
						context,
						null,
						data
					);
				})
			}
		},
	}
}
