/*
 *   Copyright (c) 2021 DSAS Holdings LTD.
 *   All rights reserved.
 */
import { BDropdownHeader, BIconPlusCircle, BDropdownItem, BIconCamera, BIconCameraFill} from 'bootstrap-vue'
import { isDevMode } from './utils';
import { VBTooltip } from 'bootstrap-vue';
import { createPopper } from '@popperjs/core'

import Vue from 'vue'

const cache = {
}

const placeholder = {
	name:'placeholder',
	directives:{
		'b-tooltip':VBTooltip
	},
	props:[
		'container',//name of the container to show in tooltip
		'tooltip',
		'size',//font size for the icon
		'tooltip-position'//where to place the tooltip.
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
		if(window.__naturaEdit){
			this.suggestions = await this.getSuggestions();
		}
		this.popper = createPopper(
			this.$refs.trigger,
			this.$refs.menu,{
				placement:'left',
			}
		);
	},
	render(h){
		if(!isDevMode()){
			return;
		}
		const vm = this;
		const naturaPath = this.naturaPath;
		const modifiers = {hover:true};
		modifiers[this.tooltipPosition||'right'] = true;
		return h(
			'div',
			{
				class:'n-placeholder',
				attrs:{'data-nignore':'true'},
				directives:[{
					name:'b-tooltip',
					value: {
						title: this.tooltip || ('insert a component into ' + (this.container || 'the container')),
						boundary:'viewport',
						placement:'left',
						trigger:'hover',
						delay:{
							hide:0,
							show:1000
						}
					},
					modifiers
				}]
			},
			[
				h(BIconPlusCircle,{
					ref:'trigger',
					class:'n-placeholder-icon ' + calcSize(vm.size),
					on:{
						click(evt){
							if(vm.shouldShow){
								vm.hide();
							}else if(vm.suggestions.list.length === 1){
								//there is one suggestion - just insert it
								__naturaEdit.dispatch('log',{event:'live.select',data:{path:naturaPath}});
								__naturaEdit.dispatch('show-path',{
									path:naturaPath,
									defaultValue:vm.suggestions.list[0].value
								});
							}else{
								vm.show()
							}
							evt.stopPropagation();
						}
					}
				}),
				h('div',{
					ref:'overlay',
					style:{display:this.shouldShow?'block':'none'},
					class:'n-viewport-overlay',
					on:{click(){
						vm.hide();
					}}
				}),
				h('ul',{
					ref:'menu',
					class:'dropdown-menu n-placeholder-menu',
					attrs:{'data-show':vm.shouldShow?'true':'false'}
				},vm.renderSuggestions(h,naturaPath))
			]
		)
	},
			
	methods:{
		renderSuggestions(h,naturaPath){
			const vm=this;
			const suggestions = (this.suggestions.list||[]).map(entry=>{
				let title = entry.description;
				if(entry.screenshot){
					title += `<img src="${encodeURI(entry.screenshot)}" class="n-suggestion-screenshot" />`
				}
				return h(
					BDropdownItem,{
						on:{
							async click(evt){
								vm.hide();
								__naturaEdit.dispatch('log',{event:'live.select',data:{path:naturaPath}})
								await __naturaEdit.editor.expand();
								await __naturaEdit.dispatch('show-path',{path:naturaPath,defaultValue:entry.value});
								evt.stopImmediatePropagation();
								evt.preventDefault();
							}
						},
						directives:[
							{
								name:'b-tooltip',
								value:{
									title,
									html:true,
									customClass:'n-suggestion-tooltip',
									boundary:'viewport',
									placement:'left',
									trigger:'hover',
									delay:{
										hide:0,
										show:1000
									}
								}
							}
						]
					},
					[
						h('span',{},[
							entry.text
						]),
						entry.screenshot? h(BIconCameraFill,{class:'n-screenshot-icon'}):undefined
					]					
				);
			})
			suggestions.unshift(
				h(BDropdownHeader,{style:{backgroundColor:'#531793'}},[
					h('span',{class:'placeholder-menu-header'},'Select component')
				]),
			);
			return suggestions;
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

export default placeholder;
Vue.component('placeholder',placeholder);