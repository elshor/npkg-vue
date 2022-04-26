import { fnComponent } from "./fn-component";

/*
 *   Copyright (c) 2022 DSAS Holdings LTD.
 *   All rights reserved.
 */
export default function generateComponent(spec,path){
	return {
		name: spec.name || spec.ref,
		render: fnComponent(spec,path)
	}
}