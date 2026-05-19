import React, { useState, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { generateStylingData, FPSMeter } from '../../shared/styling-utils';

const StylingBenchmark = () => {
	const [items, setItems] = useState(generateStylingData(1000));

	const updateStyles = useCallback(() => {
		setItems(generateStylingData(1000));
	}, []);

	return (
		<div className="container">
			<div className="jumbotron">
				<div className="row">
					<div className="col-md-6"><h1>React Styling</h1></div>
					<div className="col-md-6">
						<div className="row">
							<button id="update-styles" className="btn btn-primary" onClick={updateStyles}>Update Styles</button>
						</div>
					</div>
				</div>
			</div>
			<div className="grid">
				{items.map((item, i) => (
					<div 
						key={i}
						className="box"
						style={{
							backgroundColor: item.color,
							transform: `scale(${item.scale}) rotate(${item.rotation}deg)`
						}}
					/>
				))}
			</div>
		</div>
	);
};

ReactDOM.createRoot(document.getElementById('app')).render(<StylingBenchmark />);
