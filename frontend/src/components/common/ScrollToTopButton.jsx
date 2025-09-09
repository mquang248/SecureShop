import { useState, useEffect } from 'react'
import { ChevronUp } from 'lucide-react'

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false)

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      const scrolled = window.pageYOffset
      
      if (scrolled > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    // More natural scrolling animation
    const scrollStep = window.pageYOffset / 15
    const scrollInterval = setInterval(() => {
      if (window.pageYOffset !== 0) {
        window.scrollBy(0, -scrollStep)
      } else {
        clearInterval(scrollInterval)
      }
    }, 16) // 60fps
  }

  return (
    <div
      className={`fixed bottom-8 right-8 z-50 transition-all duration-700 ease-out transform ${
        isVisible 
          ? 'translate-y-0 opacity-100 scale-100 pointer-events-auto' 
          : 'translate-y-12 opacity-0 scale-90 pointer-events-none'
      }`}
    >
      <button
        onClick={scrollToTop}
        className="w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 group flex items-center justify-center"
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-6 h-6 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:scale-110" />
      </button>
    </div>
  )
}

export default ScrollToTopButton
