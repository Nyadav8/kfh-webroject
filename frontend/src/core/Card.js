import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import ShowImage from "./ShowImage";
import Button from "@material-ui/core/Button";
import CardM from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CssBaseline from "@material-ui/core/CssBaseline";
import DeleteIcon from "@material-ui/icons/Delete";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";

import { addItem, updateItem, removeItem, getCart } from "./cartHelpers";
const useStyles = makeStyles((theme) => ({
	icon: {
		marginRight: theme.spacing(1),
	},
	heroContent: {
		backgroundColor: theme.palette.background.paper,
		padding: theme.spacing(8, 0, 6),
	},
	heroButtons: {
		marginTop: theme.spacing(4),
	},
	cardGrid: {
		paddingTop: theme.spacing(4),
		paddingBottom: theme.spacing(4),
	},
	card: {
		height: "100%",
		display: "flex",
		flexDirection: "column",
	},
	cardMedia: {
		paddingTop: "56.25%", // 16:9
	},
	cardContent: {
		flexGrow: 1,
	},
	productDescription: {
		height: "100px",
	},
	footer: {
		backgroundColor: theme.palette.background.paper,
		padding: theme.spacing(6),
	},
}));

const Card = ({
	product,
	showViewProductButton = true,
	showAddToCartButton = true,
	cartUpdate = false,
	showRemoveProductButton = false,
	setRun = (f) => f, // default value of function
	run = undefined, // default value of undefined
}) => {
	const [redirect, setRedirect] = useState(false);
	const [count, setCount] = useState(product.count);

	const showViewButton = (showViewProductButton) => {
		return (
			showViewProductButton && (
				<Link href={`/product/${product._id}`} className="mr-2">
					<Button variant="contained" color="primary">
						View Product
					</Button>
				</Link>
			)
		);
	};

	const addToCart = () => {
		addItem(product, setRedirect(true));
	};

	const shouldRedirect = (redirect) => {
		if (redirect) {
			return <Redirect to="/cart" />;
		}
	};

	const showAddToCartBtn = (showAddToCartButton, id) => {
		var prods = [];
		var flag = true;
		prods = getCart()?.products;
		prods &&
			prods.map((prod, k) => {
				if (prod._id == id) {
					flag = false;
				}
			});
		return (
			showAddToCartButton &&
			flag && (
				<Button onClick={addToCart} variant="outlined" color="secondary">
					Add to cart
				</Button>
			)
		);
	};

	const handleChange = (productId) => (event) => {
		setRun(!run); // run useEffect in parent Cart
		var stock;
		var prods = [];
		prods = getCart()?.products;
		prods.map((prod, k) => {
			if (prod._id == productId) {
				stock = prod.quantity;
			}
		});
		setCount(event.target.value < 1 ? 1 : event.target.value > stock ? stock : event.target.value);
		if (event.target.value >= 1) {
			updateItem(productId, event.target.value);
		}
	};

	const showCartUpdateOptions = (cartUpdate) => {
		return (
			cartUpdate && (
				<div className="mt-2">
					<div className="input-group">
						<div className="input-group-prepend">
							<span className="input-group-text">Adjust Quantity</span>
						</div>
						<input type="number" className="form-control" value={count} onChange={handleChange(product._id)} />
					</div>
				</div>
			)
		);
	};

	const showRemoveButton = (showRemoveProductButton) => {
		return (
			showRemoveProductButton && (
				<Button
					onClick={() => {
						removeItem(product._id);
						setRun(!run); // run useEffect in parent Cart
					}}
					variant="contained"
					color="secondary"
					className={classes.button}
					startIcon={<DeleteIcon />}
				>
					Remove Product
				</Button>
			)
		);
	};

	const classes = useStyles();

	return (
		<Container className={classes.cardGrid} maxWidth="md">
			<CssBaseline />
			<Grid container spacing={2}>
				<Grid item xs={12} sm={12} md={12}>
					<CardM className={classes.card}>
						{shouldRedirect(redirect)}
						<ShowImage item={product} url="product" />
						<CardContent className={classes.cardContent}>
							<Typography gutterBottom variant="h5" component="h2" className="black-10">
								{product.name}
							</Typography>
							<Typography  className={`${classes.productDescription} black-10`}  >{product.description.substring(0, 100)}</Typography>
							<p className="black-10">Price: ₹{product.price}</p>
							<p className="black-9">Category: {product.category && product.category.name} </p>
							<br></br>
							<span>
								{showViewButton(showViewProductButton)}
								{showAddToCartBtn(showAddToCartButton, product?._id)}
								{showRemoveButton(showRemoveProductButton)}
							</span>
							{showCartUpdateOptions(cartUpdate)}
						</CardContent>
					</CardM>
				</Grid>
			</Grid>
		</Container>
	);
};

export default Card;
