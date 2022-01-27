import React, { Fragment } from 'react';
import pong from './pong';

function Tcanvas(props:any) {
	return (
		<Fragment>
			<canvas id="pong" style={{width: props.width, height: props.height}}></canvas>
			{pong(props)}
		</Fragment>
	)
}

export default Tcanvas;
