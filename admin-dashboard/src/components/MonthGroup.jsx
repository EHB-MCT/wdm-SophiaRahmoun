export default function MonthGroup({ users, children }) {
    const groups = users.reduce((acc, user) => {
      const month = new Date(user.createdAt).toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      })
      acc[month] = acc[month] || []
      acc[month].push(user)
      return acc
    }, {})
  
    return Object.entries(groups).map(([month, users]) => (
      <section key={month}>
        <h2 className="month-title">{month}</h2>
        <div className="month-grid">
          {users.map(children)}
        </div>
      </section>
    ))
  }