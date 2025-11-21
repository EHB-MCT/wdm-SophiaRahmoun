import { useEffect, useState } from "react";
import axios from "axios";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:4000/users").then((res) => {
      setUsers(res.data);
    });
  }, []);

  return (
    <div>
      <h1>Users</h1>
      {users.map((u) => (
        <div key={u.uid}>
          <a href={`/user/${u.uid}`}>{u.uid}</a>
        </div>
      ))}
    </div>
  );
}