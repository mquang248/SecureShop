import { Helmet } from 'react-helmet-async'

const AdminOrders = () => {
  return (
    <>
      <Helmet>
        <title>Order Management - SecureShop Admin</title>
      </Helmet>

      <div className="container-width section-padding py-12">
        <h1 className="text-3xl font-bold text-primary-900 mb-8">Order Management</h1>
        <p className="text-neutral-600">
          Order processing interface with status updates and fulfillment tracking coming soon...
        </p>
      </div>
    </>
  )
}

export default AdminOrders
