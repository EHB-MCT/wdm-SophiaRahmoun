import { Link } from "react-router-dom";

export default function UserCard({ user }) {
  return (
    <Link to={`/user/${user.uid}`} className="user-link">
      <div className="user-card">
        <h3>{user.uid}</h3>
        <p>Selfies: {user.selfieCount}</p>
        <p>
          Last seen:{" "}
          {user.lastSeen
            ? new Date(user.lastSeen).toLocaleDateString()
            : "—"}
        </p>
        <p>
          Created:{" "}
          {user.createdAt
            ? new Date(user.createdAt).toLocaleDateString()
            : "—"}
        </p>
      </div>
    </Link>
  );
}