import React, { Component } from 'react'
import { Button, Card, Image, Rating, Header, Grid, Popup, Segment, Label } from 'semantic-ui-react'
import axios from 'axios'
import { Link, Redirect } from 'react-router-dom'

const customClass = {
	margin: '25px',
}

const baseUrl = 'http://127.0.0.1:8000/productlists/'

class CardExampleGroups extends Component {
	constructor(props) {
		super(props)
		this.state.token = localStorage.getItem('Authorisation')
		axios.defaults.headers.common['Authorization'] = this.state.token
		axios.get(baseUrl).then((response) => {
			console.log(response)
			this.setState({
				result: response.data.list,
				is_admin: response.data.is_admin,
				username: response.data.username })
		})
		.catch((error) => {
			this.setState({ err: error })
		})
	}
	state = { result: null, err: null }
	buyBtnClicked(index) {
		if (this.state.token) {
			axios.post(`${baseUrl}${index.id}/buy/`, {
				product_id: index.id,
				product_name: index.product_name,
				product_description: index.product_description,
				product_quantity: 1,
			})
			.then((response) => {
				console.log(response)
			})
			.catch((error) => {
				this.setState({ err: error })
			})
		} else {
			window.location.href = '/login'
		}
	}

	logOut() {
		localStorage.clear()
		window.location.href = '/login'
	}

	addProduct() {
		window.location.href = '/addProduct'
	}

	reload(e, data) {
		window.location.href = '/'
	}

	callApi(e, data, item) {
		axios.put(`${baseUrl}${item.id}/rate/`, {
			product_ratings: data.rating,
		})
			.then((response) => {
				console.log(response)
				localStorage.setItem(response.data.product_id, response.data.product_ratings)
			})
			.catch((error) => {
				console.log(error)
			})
	}

	deleteItem(index) {
		axios.delete(`${baseUrl}${index.id}/delete`)
			.then((response) => {
				console.log(response)
			})
			.catch((errors) => {
				console.log(errors)
			})
		window.location.href = '/'
	}

	gotoEditPage(index) {
		localStorage.setItem('productId', index.id)
		window.location.href = '/addproduct'
	}

	render() {
		if (this.state.result != null) {
			return (
				<div>
					<Segment clearing>
						{
							this.state.token ?
								this.state.is_admin ?
									<Grid>
										<Grid.Column floated="left" width={5}>
											<Button onClick={this.addProduct} content="Add Product" />
										</Grid.Column>
										<Grid.Column floated="right" width={2}>
											<Label content={this.state.username} />
											<Button onClick={this.logOut} content="Signout" />
										</Grid.Column>
									</Grid>
									: <Grid>
										<Grid.Column floated="right" width={2}>
											<Label content={this.state.username} />
											<Button onClick={this.logOut} content="Signout" />
										</Grid.Column>
									</Grid>
								: <Grid>
									<Grid.Column floated="right" width={3}>
										<Label content="Wanna buy something? " />
										<Button onClick={this.logOut} content="Login" />
									</Grid.Column>
								</Grid>
							}
					</Segment>
					<Card.Group style={customClass}>
						{
							this.state.result.map((index, list) => (
								<Card>
									<Card.Content>
										<Card.Header>
											{ index.product_name }
										</Card.Header>
										<Card.Description>
											Description: { index.product_description }
										</Card.Description>
										<Card.Description>
											Quantity Available: { index.product_quantity }
										</Card.Description>
										<Card.Description>
											Average Rating: { index.ratings_average } / 5
										</Card.Description>
										<Card.Description>
											{ index.id in localStorage ? `Your rating is ${localStorage.getItem(index.id)} / 5` : null }
											{ index.id in localStorage ? <Popup
												wide
												trigger={<Button
													basic
													size="mini"
													color="green"
													content="Change"
													floated="right"
												/>}
												on="click"
												onClose={(e, data) => {
													this.reload(e, data)
												}}
											>
												<Grid>
													<Grid.Column>
														<Rating
															icon="star"
															defaultRating={1}
															maxRating={5}
															size="small"
															onRate={(e, data) => {
																this.callApi(e, data, index)
															}
															}
														/>
													</Grid.Column>
												</Grid>
											</Popup> : null }
										</Card.Description>
									</Card.Content>
									<Card.Content extra>
										{ index.product_quantity > 0 ?
											<div className="ui two buttons">
												{ !this.state.is_admin ?
														this.state.token ?
															<Popup
																wide
																trigger={<Button
																	basic
																	color="green"
																	content="BUY"
																	onClick={() => this.buyBtnClicked(index)}
																/>}
																on="click"
																onClose={(e, data) => {
																	this.reload(e, data)
																}}
															>
																<Grid>
																	<Grid.Column>
																		<Rating
																			icon="star"
																			defaultRating={1}
																			maxRating={5}
																			size="small"
																			onRate={(e, data) => {
																				this.callApi(e, data, index)
																			}
																			}
																		/>
																	</Grid.Column>
																</Grid>
															</Popup> :
															<Button basic color="green" ><Link to="/login">BUY</Link></Button>
														:
															<div className="ui two buttons">
																<Button basic color="green" onClick={() => this.gotoEditPage(index)}>EDIT</Button>
																<Popup
																	trigger={<Button color="red" content="DELETE" />}
																	content={<Button color="green" content="Confirm Delete" onClick={() => this.deleteItem(index)} />}
																	on="click"
																/>
															</div>
													}
											</div>
										: !this.state.is_admin ?
											<div className="ui">
												<Header as="h3" textAlign="center">Sold Out</Header>
											</div>
											: <div className="ui two buttons">
												<Button basic color="green" onClick={() => this.gotoEditPage(index)}>EDIT</Button>
												<Popup
													trigger={<Button color="red" content="DELETE" />}
													content={<Button color="green" content="Confirm Delete" onClick={() => this.deleteItem(index)} />}
													on="click"
												/>
											</div>
										}
									</Card.Content>
								</Card>
							))
						}
					</Card.Group>
				</div>)
		}
		if (this.state.err) {
			return (
				<Header as="h1" textAlign="center"> Oops!! Something gone wrong!!! </Header>
			)
		}
		return (
			<Header as="h1" textAlign="center"> Loading </Header>
		)
	}
}

export default CardExampleGroups
