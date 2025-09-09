import { Helmet } from 'react-helmet-async'

const AdminDashboard = () => {
  return (
    <>
      <Helmet>
        <title>Admin Dashboard - SecureShop</title>
      </Helmet>

      <div className="container-width section-padding py-12">
        <h1 className="text-3xl font-bold text-primary-900 mb-8">Admin Dashboard</h1>
        <p className="text-neutral-600">
          Admin dashboard with analytics, sales data, and system monitoring coming soon...
        </p>
      </div>
    </>
  )
}

export default AdminDashboard
