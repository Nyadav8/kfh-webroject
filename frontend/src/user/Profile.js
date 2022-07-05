import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Redirect } from "react-router-dom";
import { read, update, updateUser } from "./apiUser";

const Profile = ({ match }) => {
	const [values, setValues] = useState({
		name: "",
		email: "",
		password: "",
		address: "",
		error: false,
		success: false,
	});

	const { token } = isAuthenticated();
	const { name, email, password, address, error, success } = values;

	const init = (userId) => {
		read(userId, token).then((data) => {
			if (data.error) {
				setValues({ ...values, error: true });
			} else {
				setValues({ ...values, name: data.name, email: data.email, address: data.address });
			}
		});
	};

	useEffect(() => {
		init(match.params.userId);
	}, []);

	const handleChange = (name) => (e) => {
		setValues({ ...values, error: false, [name]: e.target.value });
	};

	const clickSubmit = (e) => {
		e.preventDefault();
		update(match.params.userId, token, { name, email, password, address }).then((data) => {
			if (data.error) {
				alert(data.error);
			} else {
				updateUser(data, () => {
					setValues({
						...values,
						name: data.name,
						email: data.email,
						address: data.address,
						success: true,
					});
				});
			}
		});
	};

	const redirectUser = (success) => {
		if (success) {
			return <Redirect to="/user/dashboard" />;
		}
	};

	const profileUpdate = (name, email, password, address) => (
		<form>
			<div className="form-group">
				<label className="text-muted">Name</label>
				<input type="text" onChange={handleChange("name")} className="form-control" value={name} />
			</div>
			<div className="form-group">
				<label className="text-muted">Email</label>
				<input type="email" onChange={handleChange("email")} className="form-control" value={email} />
			</div>
			<div className="form-group">
				<label className="text-muted">Address</label>
				<input type="text" onChange={handleChange("address")} className="form-control" value={address} />
			</div>
			<div className="form-group">
				<label className="text-muted">Password</label>
				<input type="password" onChange={handleChange("password")} className="form-control" value={password} />
			</div>

			<button onClick={clickSubmit} className="btn btn-primary">
				Submit
			</button>
		</form>
	);

	return (
		<Layout title="Profile" description="Update your profile" className="container-fluid">
			<h2 className="mb-4">Profile update</h2>
			{profileUpdate(name, email, password, address)}
			{redirectUser(success)}
		</Layout>
	);
};

export default Profile;
