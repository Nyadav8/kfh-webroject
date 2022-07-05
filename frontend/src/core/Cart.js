import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "./Layout";
import { getCart } from "./cartHelpers";
import Card from "./Card";
import Checkout from "./Checkout";

import Copyright from "./Copyright";

const Cart = () => {
	const [items, setItems] = useState([]);
	const [run, setRun] = useState(false);

	useEffect(() => {
		setItems(getCart());
	}, [run]);

	const showItems = (items) => {
		return (
			<div>
				<h2>Your cart has {`${items.products.length}`} items</h2>
				<hr />
				<div className="gridtype card-block">
				{items.products.map((product, i) => (
					
					<Card key={i} product={product} className="card-block" showAddToCartButton={false} cartUpdate={true} showRemoveProductButton={true} setRun={setRun} run={run} />
				   
				))}
				</div>
			</div>
		);
	};

	const noItemsMessage = () => (
		<h2>
			Your cart is empty. <br /> <Link to="/shop">Continue shopping</Link>
		</h2>
	);

	return (
		<Layout title="Shopping Cart" description="Manage your cart items. Add remove checkout or continue shopping." className="container-fluid">
			<div className="row ">
				{/* <div className="col-md-2"></div> */}
				<div className="col-md-4">{items && items.products && items.products.length > 0 ? showItems(items) : noItemsMessage()}</div>
				<div className="col-md-4 checkout">
					<h2 className="mb-4">Your cart summary</h2>
					<hr />
					<div className="">
					<Checkout products={items.products} setRun={setRun} run={run} />
					</div>
				</div>
				{/* <div className="col-md-2"></div> */}
			</div>
			<Copyright />
		</Layout>
	);
};

export default Cart;
