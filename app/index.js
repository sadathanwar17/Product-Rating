import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import LoginComponent from 'login'
import CardExampleGroups from 'products'
import SignUpComponent from 'signup'
import AdminComponent from 'adminpanel'

render((
	<BrowserRouter>
		<Switch>
			<Route exact path="/" component={CardExampleGroups} />
			<Route path="/login" component={LoginComponent} />
			<Route path="/signup" component={SignUpComponent} />
			<Route path="/addproduct" component={AdminComponent} />
			<Route path="/addproduct/:id" component={AdminComponent} />
		</Switch>
	</BrowserRouter>
), document.getElementById('app'))
