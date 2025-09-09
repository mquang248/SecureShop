import { Helmet } from 'react-helmet-async'

const AdminProducts = () => {
  return (
    <>
      <Helmet>
        <title>Product Management - SecureShop Admin</title>
      </Helmet>

      <div className="container-width section-padding py-12">
        <h1 className="text-3xl font-bold text-primary-900 mb-8">Product Management</h1>
        <p className="text-neutral-600">
          Product CRUD interface with inventory management and bulk operations coming soon...
        </p>
      </div>
    </>
  )
}

export default AdminProducts
