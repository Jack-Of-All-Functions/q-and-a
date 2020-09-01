import React from 'react';
import ReactDom from 'react-dom';

import './customStyle.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './components/App.jsx';

// Will have to somehow get product_id and product_name from proxy request to here
ReactDom.render(<App questions={[]} product_id={2} product_name={'YEasy 350'}/>, document.getElementById('qaModule'));
