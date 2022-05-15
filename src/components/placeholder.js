/*
 *   Copyright (c) 2021 DSAS Holdings LTD.
 *   All rights reserved.
 */
import {h, toRaw, withDirectives} from 'vue'
import { isDevMode } from '../utils';
import { createPopper } from '@popperjs/core'
import tippy from 'tippy.js';

const tooltip = {
	mounted(el,data){
		if(data.value.content){
			tippy(el,data.value)
		}
	},
	beforeUnmount(el){
		if(el._tippy){
			el._tippy.destroy();
			el._tippy = undefined;
		}
	}
}
const cache = {
}

export const Placeholder = {
	name:'placeholder',
	props:[
		'tooltip',
		'size',//font size for the icon
		'tooltipPosition',//where to place the tooltip.
		'menuTitle',
		'barText',//if set then show a bar with the text before the + icon
		'afterAdd'//function - called after inserting a suggested entity
	],
	data(){
		return {
			suggestions:{list:[]},
			popper:null,
			shouldShow:false,
			leftOffset:0
		}
	},
	async mounted(){
		const vm = this;
		if(window.__naturaEdit){
			try{
				this.suggestions = await this.getSuggestions();
				this.ensurePopper();
			}catch(e){
				console.error('Got exception getting suggestions from editor',e);
				this.suggestions = null;
			}
		}
	},
	updated(){
		this.ensurePopper();
	},
	render(){
		if(!isDevMode()){
			return;
		}
		const vm = this;
		const naturaPath = this.naturaPath;
		const modifiers = {hover:true};
		modifiers[this.tooltipPosition||'right'] = true;
		return withDirectives(h(
			'div',
			{
				class:'n-placeholder',
				'data-nignore':'true',
			},
			[
				withDirectives(
					h('span',
					{class:this.barText?'n-placeholder-bar':''},
					[
						this.barText? h('span',this.barText) : undefined,
						h('i',{
							ref:'trigger',
							class:'fa-solid fa-circle-plus n-placeholder-icon ' + calcSize(vm.size),
							onClick(evt){
								if(vm.shouldShow){
									vm.hide();
								}else if(vm.suggestions && vm.suggestions.list.length === 1){
									//there is one suggestion - just insert it
									vm.insertSuggestion(toRaw(vm.suggestions.list[0]));
								}else{
									vm.show()
								}
								evt.stopPropagation();
							}
						})
					]),
					[
						[tooltip,{
							content:vm.tooltip || 'Insert a component',
							boundary:'viewport',
							placement:'left',
							trigger:'mouseenter'
						}]			
					]
				),
				h('div',{
					ref:'overlay',
					style:{display:this.shouldShow?'block':'none'},
					class:'n-viewport-overlay',
					onClick(){
						vm.hide();
					}
				}),
				h('ul',{
					ref:'menu',
					class:'n-placeholder-menu',
					'data-show':vm.shouldShow? 'true': 'false'
				},vm.renderSuggestions(h,naturaPath))
			]
		),[
		])
	},
			
	methods:{
		renderSuggestions(h){
			const vm=this;
			const suggestions = this.suggestions?
				(this.suggestions.list||[]).map(entry=>{
				let title = entry.description;
				if(entry.screenshot){
					title += `<img src="${encodeURI(entry.screenshot)}" class="n-suggestion-screenshot" />`
				}
				return withDirectives(
						h('li',{
							onClick:function(evt){
								vm.insertSuggestion(entry);
								evt.stopImmediatePropagation();
								evt.preventDefault();

							}
						},
						[
							h('a',{
								class:'n-dropdown-item',
								role:'menuitem',
								href:'#',
								target:'_self',
							},h('span',{},
								entry.text
							)),
							/*entry.screenshot? h(BIconCameraFill,{class:'n-screenshot-icon'}):undefined*/
						]
					),[
						[tooltip,{
							content: title,
							html:true,
							customClass:'n-suggestion-tooltip',
							boundary:'viewport',
							placement:'left',
							trigger:'mouseenter',
							delay:{
								hide:0,
								show:1000
							}
						}]
					])
			}) : 
			//no suggestions
			[	
			 	h(
					'li',
					withDirectives(
						h('span',{class:'n-dropdown-item'},'No suggestions over here'),
						[[tooltip,{content:'this is a tooltip for no suggestions'}]]
					)
				)
			]
			suggestions.unshift(
				h('li',{style:{backgroundColor:'#531793'}},[
					h('header',{class:'n-dropdown-header'},[
						h('span',{class:'placeholder-menu-header'},vm.menuTitle||'Select component')
					]),
				])
			);
			return suggestions;
		},
		async insertSuggestion(entry){
			this.hide();
			try{
				__naturaEdit.dispatch('log',{event:'live.select',data:{path:this.naturaPath}})
				await __naturaEdit.editor.expand();
				const generated = await __naturaEdit.dispatch('show-path',{
					path:this.naturaPath,
					defaultValue:toRaw(entry.value),
					defaultValueType:entry.valueType
				});
				if(typeof this.afterAdd === 'function'){
					this.afterAdd(generated);
				}
			}catch(e){
				console.error('got exception inserting a component',e);
			}
		},
		async getSuggestions(){
			const suggestions = cache[this.naturaPath]
			if(suggestions){
				//using cached suggestions (or promise for suggestions)
				await suggestions;
				return suggestions;
			}else{
				const suggestions = __naturaEdit.dispatchWhenDocLoaded(
					'get-suggestions',
					{path:this.naturaPath}
				);
				cache[this.naturaPath] = suggestions;
				await suggestions;
				return suggestions
			}
		},
		show(){
			const vm = this;
			this.shouldShow = true;
			__naturaEdit.usedSkill('UsePlaceholder');
			this.$nextTick(()=>{
				if(vm.popper){
					vm.popper.update();
				}
			});
		},
		hide(){
			this.shouldShow = false;
		},
		ensurePopper(){
			if(!this.popper && this.$refs.trigger && this.$refs.menu){
				this.popper = createPopper(
					this.$refs.trigger,
					this.$refs.menu,{
						placement:'left',
					}		
				)
			}
		}
	}
}

function calcSize(s){
	switch(s){
		case 'lg':
			return 'h2';
		case 'sm':
			return 'h4'
		case 'md':
			return 'h3'
		case 'xl':
			return 'h1'
		default:
			return '';
	}
}

