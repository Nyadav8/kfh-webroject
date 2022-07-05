import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import { createOrder } from "./apiCore";
import { isAuthenticated } from "../auth";
import { useHistory } from "react-router-dom";
const Checkout = ({ products, setRun = (f) => f, run = undefined }) => {
	const [data, setData] = useState({
		loading: false,
		success: false,
		clientToken: null,
		error: "",
		instance: {},
		address: "",
	});

	const history = useHistory();

	const [prodIds, setProdIds] = useState([]);
	const [loading, setLoading] = useState(true);

	const userId = isAuthenticated() && isAuthenticated().user._id;
	const token = isAuthenticated() && isAuthenticated().token;
	useEffect(() => {
		let prodids = [];
		if (products) {
			products.map((prod, key) =>
				prodids.push({
					prodid: prod?._id,
					name: prod?.name,
					price: prod?.price,
					data: prod?.createdAt,
				})
			);
			setProdIds(prodids);
			setLoading(false);
		}
	}, [products]);

	const getTotal = () => {
		if (products && products.length > 0) {
			return products.reduce((currentValue, nextValue) => {
				return currentValue + nextValue.count * nextValue.price;
			}, 0);
		}
	};
	const showCheckout = () => {
		return (
			<>
				<h4 className="text-success">Payment Will Be Taken After Delivery</h4>
				<Button
					variant="contained"
					onClick={() =>
						createOrder(
							userId,
							token,
							{
								products: prodIds,
								amount: getTotal(products),
								address: isAuthenticated().user.address || "address",
								user: isAuthenticated().user,
							},
							(data) => {
								if (data?.products) {
									localStorage.removeItem("cart");
									history.push("/user/dashboard");
								}
							}
						)
					}
					color="primary"
				>
					Place Order
				</Button>
			</>
		);
	};

	const showError = (error) => (
		<div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
			{error}
		</div>
	);

	const showSuccess = (success) => (
		<div className="alert alert-info" style={{ display: success ? "" : "none" }}>
			Thanks! Your payment was successful!
		</div>
	);

	const showLoading = (loading) => loading && <h2 className="text-danger">Loading...</h2>;

	return (
		!loading &&
		prodIds.length > 0 && (
			<div>
				<h2>Total: ₹{getTotal()}</h2>
				{showLoading(data.loading)}
				{showSuccess(data.success)}
				{showError(data.error)}
				{showCheckout()}
			</div>
		)
	);
};

export default Checkout;
