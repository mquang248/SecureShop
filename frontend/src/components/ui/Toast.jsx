import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

const Toast = ({ type = 'info', message, onClose, duration = 4000 }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    // Trigger entrance animation
    const enterTimer = setTimeout(() => setIsVisible(true), 100)
    
    // Auto-hide toast
    const hideTimer = setTimeout(() => {
      setIsLeaving(true)
      setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300)
      }, 200)
    }, duration)

    return () => {
      clearTimeout(enterTimer)
      clearTimeout(hideTimer)
    }
  }, [duration, onClose])

  const getToastStyles = () => {
    const baseStyles = 'flex items-center p-4 rounded-xl shadow-2xl backdrop-blur-sm transition-all duration-500 ease-out transform border'
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-emerald-50/95 text-emerald-800 border-emerald-200/50 shadow-emerald-100/50`
      case 'error':
        return `${baseStyles} bg-rose-50/95 text-rose-800 border-rose-200/50 shadow-rose-100/50`
      case 'warning':
        return `${baseStyles} bg-amber-50/95 text-amber-800 border-amber-200/50 shadow-amber-100/50`
      case 'info':
      default:
        return `${baseStyles} bg-sky-50/95 text-sky-800 border-sky-200/50 shadow-sky-100/50`
    }
  }

  const getIcon = () => {
    const iconClass = 'w-5 h-5 mr-3 flex-shrink-0 transition-transform duration-300'
    
    switch (type) {
      case 'success':
        return <CheckCircle className={`${iconClass} text-emerald-500 ${isVisible ? 'scale-100' : 'scale-0'}`} />
      case 'error':
        return <XCircle className={`${iconClass} text-rose-500 ${isVisible ? 'scale-100' : 'scale-0'}`} />
      case 'warning':
        return <AlertTriangle className={`${iconClass} text-amber-500 ${isVisible ? 'scale-100' : 'scale-0'}`} />
      case 'info':
      default:
        return <Info className={`${iconClass} text-sky-500 ${isVisible ? 'scale-100' : 'scale-0'}`} />
    }
  }

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300)
    }, 200)
  }

  const getAnimationClasses = () => {
    if (isLeaving) {
      return 'translate-x-full opacity-0 scale-95'
    }
    return isVisible 
      ? 'translate-x-0 opacity-100 scale-100' 
      : 'translate-x-full opacity-0 scale-95'
  }

  return (
    <div className="fixed top-4 right-4 z-[9999] max-w-sm w-full pointer-events-none">
      <div
        className={`${getToastStyles()} ${getAnimationClasses()} pointer-events-auto`}
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)'
        }}
      >
        {getIcon()}
        <div className="flex-1 text-sm font-medium leading-relaxed">
          {message}
        </div>
        <button
          onClick={handleClose}
          className="ml-3 p-1.5 rounded-full hover:bg-black/10 transition-all duration-200 hover:scale-110"
          aria-label="Close notification"
        >
          <X className="w-4 h-4 opacity-60 hover:opacity-100" />
        </button>
      </div>
    </div>
  )
}

export default Toast