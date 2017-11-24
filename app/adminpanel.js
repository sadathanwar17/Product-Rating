import React, { Component } from 'react'
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react'
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios'
import '../semantic/dist/semantic.min.css'

const baseUrl = 'http://127.0.0.1:8000/productlists/'
const verifyUserUrl = 'http://127.0.0.1:8000/verifyadmin/'

class AdminComponent extends Component {
	constructor(props) {
		super(props)
		this.state.token = localStorage.getItem('Authorisation')
		axios.defaults.headers.common['Authorization'] = this.state.token
		axios.defaults.headers.post['Content-Type'] = 'application/json'
		if (this.state.token) {
			axios.get(`${verifyUserUrl}${this.state.token.split(' ')[1]}`).then((response) => {
				this.setState({ is_admin: response.data.is_admin })
			}).catch((error) => {
				console.log(error)
			})
		}
		'productId' in localStorage ?
			axios.get(`${baseUrl}${localStorage.getItem('productId')}/`)
				.then((response) => {
					this.setState({
						prod_name: response.data.product_name,
						prod_desc: response.data.product_description,
						prod_quant: response.data.product_quantity,
					})
				})
				.catch((error) => {
					console.log(error)
				})
				: null
	}
	state = { prod_name: '', prod_desc: '', prod_quant: '', error: '', token: '', is_admin: '' }

	handleChange = (e, { name, value }) => this.setState({ [name]: value })

	handleSubmit = (e) => {
		'productId' in localStorage ?
		axios.put(`${baseUrl}${localStorage.getItem('productId')}/`, {
			product_name: this.state.prod_name,
			product_description: this.state.prod_desc,
			product_quantity: this.state.prod_quant,
		})
			.then((response) => {
				console.log(response)
				localStorage.removeItem('productId')
				window.location.href = '/'
			})
			.catch((errors) => {
				console.log(errors)
			})
		:	axios.post(baseUrl, {
			product_name: this.state.prod_name,
			product_description: this.state.prod_desc,
			product_quantity: this.state.prod_quant,
		})
			.then((response) => {
				window.location.href = '/'
			})
			.catch((errors) => {
				this.setState({ error: errors })
			})
		e.preventDefault()
	}

	render() {
		if (this.state.is_admin) {
			return (
				<div>
					<style>
						{`
							body > div,
							body > div > div,
							body > div > div > div
							{
								height: 100%;
							},
						`}
					</style>
					<Grid
						textAlign="center"
						style={{ height: '100%' }}
						verticalAlign="middle"
					>
						<Grid.Column style={{ maxWidth: 450 }}>
							{this.state.error ? <Header as="h3" color="red">Error Occured</Header> : null}
							<Header as="h2" color="teal" textAlign="center">
								{' '}Add New Product
							</Header>
							<Form size="large" onSubmit={this.handleSubmit}>
								<Segment stacked>
									<Form.Input
										fluid
										placeholder="Product Name"
										name="prod_name"
										value={this.state.prod_name ? this.state.prod_name : ''}
										onChange={this.handleChange}
									/>
									<Form.Input
										fluid
										placeholder="Product Description"
										name="prod_desc"
										value={this.state.prod_desc ? this.state.prod_desc : ''}
										onChange={this.handleChange}
									/>
									<Form.Input
										fluid
										placeholder="Product Quantity"
										name="prod_quant"
										type="number"
										value={this.state.prod_quant ? this.state.prod_quant : ''}
										onChange={this.handleChange}
									/>
									<Button color="teal" fluid size="large">Add/Edit Product</Button>
								</Segment>
							</Form>
						</Grid.Column>
					</Grid>
				</div>)
		}
		return <Header as="h1" color="black" textAlign="center"> Sorry Unauthorised to access this page </Header>
	}
}

export default AdminComponent
