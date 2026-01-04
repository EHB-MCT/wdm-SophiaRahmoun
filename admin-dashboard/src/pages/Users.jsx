import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UserCard from "../components/UserCard";

export default function Users({ users, onRefresh }) {
	if (!users) {
		return <div className="users-page">Loading users…</div>;
	}
	const [filters, setFilters] = useState({
		ageRange: "",
		emotion: "",
		dateRange: "",
	});
  const resetFilters = () => {
    setFilters({
      ageRange: "",
      emotion: "",
      dateRange: "",
    })
  }
	const [filteredUsers, setFilteredUsers] = useState(users);

	useEffect(() => {
		let result = [...users];

		if (filters.ageRange) {
			const [min, max] = filters.ageRange.split("-");
			result = result.filter((u) => {
				const age = u.lastAnalysis?.estimatedAge;
				if (!age) return false;
				if (!max) return age >= Number(min);
				return age >= Number(min) && age <= Number(max);
			});
		}

		if (filters.emotion) {
			result = result.filter(
				(u) => u.lastAnalysis?.dominantEmotion === filters.emotion
			);
		}

		if (filters.dateRange) {
			const days = Number(filters.dateRange);
			const since = new Date();
			since.setDate(since.getDate() - days);

			result = result.filter((u) => new Date(u.lastSeen) >= since);
		}

		setFilteredUsers(result);
	}, [users, filters]);

	if (!users || users.length === 0) {
		return <div className="users-page">Loading users…</div>;
	}

	return (
		<div className="users-page">
			<div className="page-header">
				<h1>Users</h1>

				<button onClick={onRefresh} className="refresh-btn">
					Refresh
				</button>
			</div>

			<div className="filters">
				<h3>Filters</h3>
				<div className="filter-controls">
					<select
						value={filters.ageRange}
						onChange={(e) =>
							setFilters({ ...filters, ageRange: e.target.value })
						}
					>
						<option value="">All Ages</option>
						<option value="18-25">18-25</option>
						<option value="26-35">26-35</option>
						<option value="36-50">36-50</option>
						<option value="51+">51+</option>
					</select>

					<select
						value={filters.emotion}
						onChange={(e) =>
							setFilters({ ...filters, emotion: e.target.value })
						}
					>
						<option value="">All Emotions</option>
						<option value="happy">Happy</option>
						<option value="sad">Sad</option>
						<option value="angry">Angry</option>
						<option value="neutral">Neutral</option>
					</select>

					<select
						value={filters.dateRange}
						onChange={(e) =>
							setFilters({ ...filters, dateRange: e.target.value })
						}
					>
						<option value="">All Time</option>
						<option value="7">Last 7 days</option>
						<option value="30">Last 30 days</option>
						<option value="90">Last 90 days</option>
					</select>

					<button onClick={resetFilters}>Reset</button>
				</div>
			</div>


			{filteredUsers.length === 0 ? (
				<div className="no-results">
					<p>No users found matching the selected filters.</p>
				</div>
			) : (
				<div className="users-grid">
					{filteredUsers.map((user) => (
						<UserCard key={user.uid} user={user} />
					))}
				</div>
			)}
		</div>
	);
}
