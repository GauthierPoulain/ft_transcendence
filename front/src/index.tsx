import React from 'react';
import ReactDOM from 'react-dom';
import './static/styles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './auth';
import CacheProvider from "./api/CacheProvider"

ReactDOM.render(
	<AuthProvider>
		<CacheProvider>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</CacheProvider>
	</AuthProvider>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
