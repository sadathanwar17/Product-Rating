import React, { Component } from 'react'
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react'
import { Link, Redirect } from 'react-router-dom'
import { browserHistory } from 'react-router'
import axios from 'axios'
import '../semantic/dist/semantic.min.css'

const baseUrl = 'http://127.0.0.1:8000/login/'

class LoginComponent extends Component {

	state = { username: '', password: '', token: '', is_admin: '' }
	handleChange = (e, { name, value }) => this.setState({ [name]: value })

	handleSubmit = (e) => {
		axios.post(baseUrl, {
			username: this.state.username,
			password: this.state.password,
		})
		.then((response) => {
			if (response.data.token) {
				localStorage.setItem('Authorisation', `Token ${response.data.token}`)
				if (response.data.admin) {
					window.location.href = '/'
					return
				}
				window.location.href = '/'
			}
		})
		.catch((error) => {
			console.log(error)
		})
		e.preventDefault()
	}

	render() {
		if (localStorage.getItem('Authorisation')) return <Redirect to="/" />
		return (
			<div className="login-form">
				<style>
					{`
						body > div,
						body > div > div,
						body > div > div > div.login-form
						{
						height: 100%;
						}
					`}
				</style>
				<Grid
					textAlign="center"
					style={{ height: '100%' }}
					verticalAlign="middle"
				>
					<Grid.Column style={{ maxWidth: 450 }}>
						<Header as="h2" color="teal" textAlign="center">
							{' '}Log-in to your account
						</Header>
						<Form size="large" onSubmit={this.handleSubmit}>
							<Segment stacked>
								<Form.Input
									fluid
									icon="user"
									iconPosition="left"
									placeholder="Username"
									name="username"
									onChange={this.handleChange}
								/>
								<Form.Input
									fluid
									icon="lock"
									iconPosition="left"
									placeholder="Password"
									type="password"
									name="password"
									onChange={this.handleChange}
								/>
								<Button color="teal" fluid size="large">Login</Button>
							</Segment>
						</Form>
						<Message>
							New to us? <Link to="/signup">Sign Up</Link>
						</Message>
					</Grid.Column>
				</Grid>
			</div>)
	}
}

export default LoginComponent
