import { Shield, Lock, CheckCircle } from 'lucide-react'

const SecurityBadge = ({ 
  text, 
  type = 'shield', 
  variant = 'primary',
  size = 'sm' 
}) => {
  const getIcon = () => {
    const iconClass = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'
    
    switch (type) {
      case 'lock':
        return <Lock className={`${iconClass} mr-1`} />
      case 'check':
        return <CheckCircle className={`${iconClass} mr-1`} />
      case 'shield':
      default:
        return <Shield className={`${iconClass} mr-1`} />
    }
  }

  const getStyles = () => {
    const baseStyles = 'inline-flex items-center font-medium rounded-full border'
    const sizeStyles = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-sm'
    
    switch (variant) {
      case 'success':
        return `${baseStyles} ${sizeStyles} bg-green-100 text-green-800 border-green-200`
      case 'warning':
        return `${baseStyles} ${sizeStyles} bg-yellow-100 text-yellow-800 border-yellow-200`
      case 'info':
        return `${baseStyles} ${sizeStyles} bg-blue-100 text-blue-800 border-blue-200`
      case 'white':
        return `${baseStyles} ${sizeStyles} bg-white/20 text-white border-white/30 backdrop-blur-sm`
      case 'primary':
      default:
        return `${baseStyles} ${sizeStyles} bg-primary-100 text-primary-800 border-primary-200`
    }
  }

  return (
    <span className={getStyles()}>
      {getIcon()}
      {text}
    </span>
  )
}

export default SecurityBadge
