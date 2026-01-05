import { useState, useEffect } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Link,
	useParams,
} from "react-router-dom";
import Users from "./pages/Users";
import Analytics from "./pages/Analytics";
import "./App.css";
import UserDetail from "./pages/UserDetail";

function App() {
	const [users, setUsers] = useState([]);
	const [analytics, setAnalytics] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		Promise.all([fetchUsers(), fetchAnalytics()]).finally(() =>
			setLoading(false)
		);
	}, []);

	const fetchUsers = async () => {
		try {
			const response = await fetch("http://localhost:3000/api/admin/users");
			const data = await response.json();
			setUsers(data);
		} catch (error) {
			console.error("Failed to fetch users:", error);
		}
	};

	const fetchAnalytics = async () => {
		try {
			const response = await fetch("http://localhost:3000/api/admin/analytics");
			const data = await response.json();
			setAnalytics(data);
		} catch (error) {
			console.error("Failed to fetch analytics:", error);
		}
	};

	if (loading) {
		return <div className="main-content">Loading dashboard…</div>;
	}
	return (
		<Router>
			<div className="app">
				<nav className="navbar">
					<h1>Admin Dashboard</h1>
					<div className="nav-links">
						<Link to="/">Users</Link>
						<Link to="/analytics">Analytics</Link>
					</div>
				</nav>

				<main className="main-content">
					<Routes>
						<Route
							path="/"
							element={<Users users={users} onRefresh={fetchUsers} />}
						/>

						<Route
							path="/analytics"
							element={
								<Analytics analytics={analytics} onRefresh={fetchAnalytics} />
							}
						/>
						<Route path="/user/:uid" element={<UserDetail />} />
					</Routes>
				</main>
			</div>
		</Router>
	);
}


export default App;
