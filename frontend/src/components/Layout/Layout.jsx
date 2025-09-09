import Header from './Header.jsx'
import Footer from './Footer.jsx'
import ScrollToTopButton from '../common/ScrollToTopButton.jsx'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  )
}

export default Layout
