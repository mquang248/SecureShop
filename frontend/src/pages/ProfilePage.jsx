import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Lock, 
  Shield, 
  Settings,
  Save,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Camera,
  Bell
} from 'lucide-react'
import api from '../utils/api'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const ProfilePage = () => {
  const { user: currentUser, updateProfile } = useAuth()
  const { showToast } = useToast()
  const queryClient = useQueryClient()
  
  const [activeTab, setActiveTab] = useState('personal')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  
  // Personal Info Form
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Vietnam'
    }
  })

  // Password Form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailMarketing: true,
    emailOrderUpdates: true,
    emailSecurity: true,
    pushNotifications: false
  })

  // Fetch user profile
  const { data: userProfile, isLoading: loadingProfile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await api.get('/users/profile')
      return response.data.data
    }
  })

  // Update form data when profile loads
  useEffect(() => {
    if (userProfile) {
      setPersonalInfo({
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        address: userProfile.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'Vietnam'
        }
      })
      setNotificationSettings({
        emailMarketing: userProfile.preferences?.emailMarketing ?? true,
        emailOrderUpdates: userProfile.preferences?.emailOrderUpdates ?? true,
        emailSecurity: userProfile.preferences?.emailSecurity ?? true,
        pushNotifications: userProfile.preferences?.pushNotifications ?? false
      })
    }
  }, [userProfile])

  // Update personal info mutation
  const updatePersonalInfoMutation = useMutation({
    mutationFn: async (data) => {
      // Use AuthContext updateProfile to ensure user data is updated
      const updatedUser = await updateProfile(data)
      return updatedUser
    },
    onSuccess: () => {
      showToast('Profile updated successfully!', 'success')
      queryClient.invalidateQueries(['user-profile'])
    },
    onError: (error) => {
      showToast(error.response?.data?.message || 'Failed to update profile', 'error')
    }
  })

  // Update password mutation
  const updatePasswordMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.put('/users/change-password', data)
      return response.data
    },
    onSuccess: () => {
      showToast('Password updated successfully!', 'success')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    },
    onError: (error) => {
      showToast(error.response?.data?.message || 'Failed to update password', 'error')
    }
  })

  // Update notifications mutation
  const updateNotificationsMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.put('/users/preferences', { preferences: data })
      return response.data
    },
    onSuccess: () => {
      showToast('Notification settings updated!', 'success')
    },
    onError: (error) => {
      showToast(error.response?.data?.message || 'Failed to update notifications', 'error')
    }
  })

  const handlePersonalInfoSubmit = (e) => {
    e.preventDefault()
    updatePersonalInfoMutation.mutate(personalInfo)
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('New passwords do not match', 'error')
      return
    }

    if (passwordForm.newPassword.length < 8) {
      showToast('Password must be at least 8 characters', 'error')
      return
    }

    updatePasswordMutation.mutate({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    })
  }

  const handleNotificationSubmit = (e) => {
    e.preventDefault()
    updateNotificationsMutation.mutate(notificationSettings)
  }

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ]

  return (
    <>
      <Helmet>
        <title>Profile Settings - SecureShop</title>
        <meta name="description" content="Manage your profile settings, security, and notification preferences." />
      </Helmet>

      <div className="min-h-screen bg-neutral-50 py-8">
        <div className="container-width">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary-900 mb-2">Profile Settings</h1>
            <p className="text-neutral-600">Manage your account settings and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-900">{userProfile?.firstName} {userProfile?.lastName}</h3>
                    <p className="text-sm text-neutral-600">{userProfile?.email}</p>
                  </div>
                </div>
                
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                          activeTab === tab.id
                            ? 'bg-primary-100 text-primary-700 border-l-4 border-primary-600'
                            : 'text-neutral-700 hover:bg-neutral-100'
                        }`}
                      >
                        <IconComponent className="w-5 h-5" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    )
                  })}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm">
                {/* Personal Info Tab */}
                {activeTab === 'personal' && (
                  <div className="p-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <User className="w-6 h-6 text-primary-600" />
                      <h2 className="text-2xl font-bold text-primary-900">Personal Information</h2>
                    </div>

                    {loadingProfile ? (
                      <div className="flex justify-center py-8">
                        <LoadingSpinner size="lg" />
                      </div>
                    ) : (
                      <form onSubmit={handlePersonalInfoSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                              First Name
                            </label>
                            <input
                              type="text"
                              value={personalInfo.firstName}
                              onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="Enter your first name"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                              Last Name
                            </label>
                            <input
                              type="text"
                              value={personalInfo.lastName}
                              onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="Enter your last name"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                              Email Address
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                              <input
                                type="email"
                                value={personalInfo.email}
                                onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="Enter your email"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                              Phone Number
                            </label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                              <input
                                type="tel"
                                value={personalInfo.phone}
                                onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="Enter your phone number"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Address Section */}
                        <div className="border-t pt-6">
                          <h3 className="text-lg font-semibold text-primary-900 mb-4 flex items-center">
                            <MapPin className="w-5 h-5 mr-2" />
                            Address Information
                          </h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Street Address
                              </label>
                              <input
                                type="text"
                                value={personalInfo.address.street}
                                onChange={(e) => setPersonalInfo({ 
                                  ...personalInfo, 
                                  address: { ...personalInfo.address, street: e.target.value }
                                })}
                                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="Enter your street address"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-neutral-700 mb-2">
                                City
                              </label>
                              <input
                                type="text"
                                value={personalInfo.address.city}
                                onChange={(e) => setPersonalInfo({ 
                                  ...personalInfo, 
                                  address: { ...personalInfo.address, city: e.target.value }
                                })}
                                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="Enter your city"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-neutral-700 mb-2">
                                State/Province
                              </label>
                              <input
                                type="text"
                                value={personalInfo.address.state}
                                onChange={(e) => setPersonalInfo({ 
                                  ...personalInfo, 
                                  address: { ...personalInfo.address, state: e.target.value }
                                })}
                                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="Enter your state/province"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-neutral-700 mb-2">
                                ZIP/Postal Code
                              </label>
                              <input
                                type="text"
                                value={personalInfo.address.zipCode}
                                onChange={(e) => setPersonalInfo({ 
                                  ...personalInfo, 
                                  address: { ...personalInfo.address, zipCode: e.target.value }
                                })}
                                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="Enter your ZIP/postal code"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Country
                              </label>
                              <select
                                value={personalInfo.address.country}
                                onChange={(e) => setPersonalInfo({ 
                                  ...personalInfo, 
                                  address: { ...personalInfo.address, country: e.target.value }
                                })}
                                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              >
                                <option value="Vietnam">Vietnam</option>
                                <option value="United States">United States</option>
                                <option value="Canada">Canada</option>
                                <option value="United Kingdom">United Kingdom</option>
                                <option value="Australia">Australia</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={updatePersonalInfoMutation.isLoading}
                            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                          >
                            {updatePersonalInfoMutation.isLoading ? (
                              <>
                                <LoadingSpinner size="sm" className="mr-2" />
                                Updating...
                              </>
                            ) : (
                              <>
                                <Save className="w-5 h-5 mr-2" />
                                Save Changes
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div className="p-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <Shield className="w-6 h-6 text-primary-600" />
                      <h2 className="text-2xl font-bold text-primary-900">Security Settings</h2>
                    </div>

                    <form onSubmit={handlePasswordSubmit} className="space-y-6">
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start">
                          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                          <div className="text-sm text-amber-700">
                            <strong>Security Notice:</strong> Choose a strong password with at least 8 characters, including uppercase, lowercase, numbers, and special characters.
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                          <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                            className="w-full pl-10 pr-12 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Enter your current password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                          >
                            {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                            className="w-full pl-10 pr-12 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Enter your new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                          >
                            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                          <input
                            type="password"
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Confirm your new password"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={updatePasswordMutation.isLoading}
                          className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                          {updatePasswordMutation.isLoading ? (
                            <>
                              <LoadingSpinner size="sm" className="mr-2" />
                              Updating...
                            </>
                          ) : (
                            <>
                              <Lock className="w-5 h-5 mr-2" />
                              Update Password
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div className="p-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <Bell className="w-6 h-6 text-primary-600" />
                      <h2 className="text-2xl font-bold text-primary-900">Notification Preferences</h2>
                    </div>

                    <form onSubmit={handleNotificationSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                          <div>
                            <h4 className="font-medium text-primary-900">Marketing Emails</h4>
                            <p className="text-sm text-neutral-600">Receive emails about new products and promotions</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationSettings.emailMarketing}
                              onChange={(e) => setNotificationSettings({ ...notificationSettings, emailMarketing: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                          <div>
                            <h4 className="font-medium text-primary-900">Order Updates</h4>
                            <p className="text-sm text-neutral-600">Receive emails about your order status</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationSettings.emailOrderUpdates}
                              onChange={(e) => setNotificationSettings({ ...notificationSettings, emailOrderUpdates: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                          <div>
                            <h4 className="font-medium text-primary-900">Security Alerts</h4>
                            <p className="text-sm text-neutral-600">Receive emails about account security</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationSettings.emailSecurity}
                              onChange={(e) => setNotificationSettings({ ...notificationSettings, emailSecurity: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                          <div>
                            <h4 className="font-medium text-primary-900">Push Notifications</h4>
                            <p className="text-sm text-neutral-600">Receive browser push notifications</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationSettings.pushNotifications}
                              onChange={(e) => setNotificationSettings({ ...notificationSettings, pushNotifications: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={updateNotificationsMutation.isLoading}
                          className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                          {updateNotificationsMutation.isLoading ? (
                            <>
                              <LoadingSpinner size="sm" className="mr-2" />
                              Updating...
                            </>
                          ) : (
                            <>
                              <Settings className="w-5 h-5 mr-2" />
                              Save Preferences
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfilePage
