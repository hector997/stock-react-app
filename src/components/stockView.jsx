import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
export default function StockView({ stockData }) {
	const [dataArr, setDataArr] = useState([]);
	useEffect(() => {
		let localData = [];
		stockData.forEach((element) => {
			localData.push(parseFloat(element.high));
		});
		setDataArr(localData.splice(localData.length - 50, localData.length));
	}, []);
	const options = {
		title: {
			text: 'cotización',
		},
		yAxis: {
			title: {
				text: 'usd',
			},
		},
		series: [
			{
				name: 'Stock',
				data: dataArr,
			},
		],
	};
	console.log('stockData', dataArr);
	return (
		<div>
			<HighchartsReact
				highcharts={Highcharts}
				options={options}
			></HighchartsReact>
		</div>
	);
}
