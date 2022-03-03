/*
 *   Copyright (c) 2022 DSAS Holdings LTD.
 *   All rights reserved.
 */
module.exports = {
	entry:'./src/app.js',
	output:{
		library:{
			name:'npkgvue',
			type:'umd2'
		}
	},
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.(woff(2)?|ttf|jpg|jpeg|png|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
				use: ['file-loader'],
			},
		],
	}
}
