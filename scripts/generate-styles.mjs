/*
 *   Copyright (c) 2022 DSAS Holdings LTD.
 *   All rights reserved.
 */
import {writeFileSync, readFileSync} from 'fs'

const fileText = readFileSync('styles.json','utf-8');
const json = JSON.parse(fileText);
const output = {entities:{$type:'entity definition group'}};
output.entities.members = Object.entries(json).map(([name,description])=>({
	name: name + '(style)',
	description,
	isa:['style config'],
	title: name.replace(/\-/g,' ') + ' (style)',
	pattern:name.replace(/\-/g,' ') + ' (style): <<value>>',
	properties:{
		value:{type:'string'}
	},
	$generic:'component config',
	$specialized:{
		type:'style',
		key:name
	}
}))
writeFileSync('styles-spec.json',JSON.stringify(output,null,'  '))
