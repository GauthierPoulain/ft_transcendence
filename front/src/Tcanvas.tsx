import React, { Fragment } from 'react';

function Tcanvas(props:any) {
	return (
		<Fragment>
			<script>pong({props.width}, {props.height})</script>
			<canvas id="pong" style={{width: props.width, height: props.height}}></canvas>
		</Fragment>
	)
}

export default Tcanvas;
