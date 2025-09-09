import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Star, User, MessageCircle, ThumbsUp, Send } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import api from '../../utils/api'

const ProductReviews = ({ productId, productName }) => {
  const { isAuthenticated, user } = useAuth()
  const { showToast } = useToast()
  const queryClient = useQueryClient()
  
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  })

  // Fetch reviews
  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ['product-reviews', productId],
    queryFn: async () => {
      const response = await api.get(`/products/${productId}/reviews`)
      return response.data.data
    },
    enabled: !!productId
  })

  // Add review mutation
  const addReviewMutation = useMutation({
    mutationFn: async (reviewData) => {
      const response = await api.post(`/products/${productId}/reviews`, reviewData)
      return response.data
    },
    onSuccess: () => {
      showToast('Your review has been added successfully!', 'success')
      setNewReview({ rating: 5, comment: '' })
      setShowReviewForm(false)
      queryClient.invalidateQueries(['product-reviews', productId])
      queryClient.invalidateQueries(['product', productId])
    },
    onError: (error) => {
      showToast(error.response?.data?.message || 'Unable to add review', 'error')
    }
  })

  const handleSubmitReview = (e) => {
    e.preventDefault()
    
    if (!newReview.comment.trim()) {
      showToast('Please enter review content', 'warning')
      return
    }

    if (newReview.comment.trim().length < 10) {
      showToast('Review must be at least 10 characters long', 'warning')
      return
    }

    addReviewMutation.mutate({
      rating: newReview.rating,
      comment: newReview.comment.trim()
    })
  }

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    return [...Array(5)].map((_, index) => {
      const filled = index < rating
      return (
        <Star
          key={index}
          className={`w-5 h-5 ${
            filled ? 'text-yellow-400 fill-current' : 'text-gray-300'
          } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
          onClick={interactive ? () => onStarClick(index + 1) : undefined}
        />
      )
    })
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getRatingDistribution = () => {
    if (!reviewsData?.reviews?.length) return {}
    
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviewsData.reviews.forEach(review => {
      distribution[review.rating] = (distribution[review.rating] || 0) + 1
    })
    
    return distribution
  }

  const ratingDistribution = getRatingDistribution()
  const totalReviews = reviewsData?.totalReviews || 0
  const averageRating = reviewsData?.averageRating || 0

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 border-b border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              Product Reviews
            </h3>
            <p className="text-gray-600">Share your experience with the community</p>
          </div>
          {isAuthenticated && !showReviewForm && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Write Review
            </button>
          )}
        </div>

        {/* Rating Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Overall Rating */}
          <div className="text-center bg-white rounded-xl p-6 shadow-sm">
            <div className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-3">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center mb-3">
              {renderStars(Math.round(averageRating))}
            </div>
            <p className="text-gray-600 font-medium">
              {totalReviews} reviews
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4">Rating Distribution</h4>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map(rating => {
                const count = ratingDistribution[rating] || 0
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
                
                return (
                  <div key={rating} className="flex items-center space-x-3">
                    <span className="w-12 text-sm font-medium text-gray-700 flex items-center">
                      {rating} <Star className="w-3 h-3 text-yellow-400 fill-current ml-1" />
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="w-8 text-sm font-medium text-gray-600">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="p-8 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
          <div className="max-w-2xl mx-auto">
            <h4 className="text-xl font-bold text-gray-900 mb-2">
              Share Your Review
            </h4>
            <p className="text-gray-600 mb-6">for {productName}</p>
          
            <form onSubmit={handleSubmitReview} className="space-y-6">
              {/* Rating */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Your Rating
                </label>
                <div className="flex space-x-2">
                  {renderStars(newReview.rating, true, (rating) => 
                    setNewReview(prev => ({ ...prev, rating }))
                  )}
                  <span className="ml-3 text-sm font-medium text-gray-600">
                    {newReview.rating}/5 stars
                  </span>
                </div>
              </div>

              {/* Comment */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Review Content
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                  placeholder="Share your experience with this product..."
                  maxLength={500}
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-500">
                    Minimum 10 characters
                  </p>
                  <p className="text-sm text-gray-500">
                    {newReview.comment.length}/500 characters
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={addReviewMutation.isLoading}
                  className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {addReviewMutation.isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : (
                    <Send className="w-5 h-5 mr-2" />
                  )}
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="p-8">
        {reviewsData?.reviews?.length > 0 ? (
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-gray-900 mb-6">Customer Reviews</h4>
            {reviewsData.reviews.map((review, index) => (
              <div key={index} className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-start space-x-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center ring-4 ring-white shadow-sm">
                      <User className="w-7 h-7 text-blue-600" />
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h5 className="font-bold text-gray-900 text-lg">
                          {review.user?.firstName} {review.user?.lastName}
                        </h5>
                        <div className="flex items-center space-x-3 mt-1">
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm text-gray-500 font-medium">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                      </div>
                      {review.verified && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 ring-1 ring-green-200">
                          ✓ Verified Purchase
                        </span>
                      )}
                    </div>
                    
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-50">
                      <p className="text-gray-700 leading-relaxed text-base">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-neutral-900 mb-2">
              No Reviews Yet
            </h4>
            <p className="text-neutral-600 mb-6">
              Be the first to review this product
            </p>
            {isAuthenticated && !showReviewForm && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Write First Review
              </button>
            )}
          </div>
        )}

        {/* Login Prompt */}
        {!isAuthenticated && !showReviewForm && (
          <div className="mt-8 p-6 bg-neutral-50 rounded-lg text-center">
            <p className="text-neutral-600 mb-4">
              Sign in to write a review for this product
            </p>
            <a
              href="/login"
              className="inline-flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Sign In
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductReviews
