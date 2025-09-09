const LoadingSpinner = ({ size = 'md', color = 'accent' }) => {
  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4'
      case 'lg':
        return 'w-8 h-8'
      case 'xl':
        return 'w-12 h-12'
      case 'md':
      default:
        return 'w-6 h-6'
    }
  }

  const getColorClass = () => {
    switch (color) {
      case 'white':
        return 'border-white/30 border-t-white'
      case 'primary':
        return 'border-primary-200 border-t-primary-600'
      case 'accent':
      default:
        return 'border-accent-200 border-t-accent-500'
    }
  }

  return (
    <div className={`${getSizeClass()} border-2 border-solid rounded-full animate-spin ${getColorClass()}`}>
    </div>
  )
}

export default LoadingSpinner
