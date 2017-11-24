import React, { Component } from 'react'
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react'
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios'
import '../semantic/dist/semantic.min.css'

const baseUrl = 'http://127.0.0.1:8000/createuser/'

class SignUpComponent extends Component {
	state = { username: '', email: '', password: '' }
	handleChange = (e, { name, value }) => this.setState({ [name]: value })
	handleSubmit = (e) => {
		axios.post(baseUrl, {
			username: this.state.username,
			password: this.state.password,
		})
		.then((response) => {
			window.location.href = '/login'
		})
		.catch((error) => {
			console.log(error)
		})
		e.preventDefault()
	}
	render() {
		if (localStorage.getItem('Authorisation')) return <Redirect to="/" />
		return (
			<div className="signup-form">
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
							{' '}Create an account
						</Header>
						<Form size="large" onSubmit={this.handleSubmit}>
							<Segment stacked>
								<Form.Input
									fluid
									icon="user"
									iconPosition="left"
									placeholder="Username"
									id="username"
									name="username"
									onChange={this.handleChange}
								/>
								<Form.Input
									fluid
									icon="user"
									iconPosition="left"
									placeholder="E-mail address"
									id="email"
									name="email"
									onChange={this.handleChange}
								/>
								<Form.Input
									fluid
									icon="lock"
									iconPosition="left"
									placeholder="Password"
									type="password"
									id="password"
									name="password"
									onChange={this.handleChange}
								/>
								<Button color="teal" fluid size="large">SignUp</Button>
							</Segment>
						</Form>
						<Message>
							Already have an account? <Link to="/login">Log In</Link>
						</Message>
					</Grid.Column>
				</Grid>
			</div>
		)
	}
}

export default SignUpComponent
