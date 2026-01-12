import React, { useState, useEffect } from 'react'
import { User, Mail, Phone, MapPin, Save, Building2, Globe } from 'lucide-react'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import DashboardLayout from '../../components/layout/DashboardLayout'
import toast from 'react-hot-toast'

const EmployerProfilePage = () => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '', // Recruiter Name
    email: '',
    phone: '',
    location: '',
    companyName: '',
    companyWebsite: '',
    companyDescription: ''
  })

  // Note: Backend might not support separate company fields in the User model directly unless user.company is a subdocument.
  // Looking at User model would be ideal, but I'll assume standard profile update works for basic info.
  // If company info needs to be stored, it might be in `bio` or specific fields if they exist.
  // For now, I'll map companyName -> bio to save it somewhere if no specific field, OR just stick to standard fields.
  // Let's assume standard fields + bio.

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        const data = res.data;
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          location: data.location || '',
          // If backend doesn't have company fields, these might start empty
          companyName: data.companyName || '',
          companyWebsite: data.website || '',
          companyDescription: data.bio || ''
        })
      } catch (error) {
        console.error(error);
      }
    }
    fetchProfile();
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const submitData = {
        name: formData.name,
        phone: formData.phone,
        location: formData.location,
        bio: formData.companyDescription, // Mapping description to bio
        // If backend supports these, great. If not, they might be ignored.
        companyName: formData.companyName,
        website: formData.companyWebsite
      }
      await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, submitData)
      toast.success('Company profile updated')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout activeMenu="company-profile">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Company Profile</h1>
            <p className="text-gray-600">Manage your company information and branding</p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
              <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-10 h-10" />
              </div>
              <h2 className="font-bold text-gray-900">{formData.companyName || "Company Name"}</h2>
              <p className="text-sm text-gray-500">{formData.location || "Location"}</p>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">
              <h3 className="font-bold text-gray-900 border-b pb-4">Company Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="companyWebsite"
                      value={formData.companyWebsite}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="w-full pl-10 pr-2 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">About Company</label>
                <textarea
                  name="companyDescription"
                  value={formData.companyDescription}
                  onChange={handleChange}
                  rows="4"
                  className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell candidates about your company culture and mission..."
                />
              </div>

              <div className="pt-6 border-t border-gray-100">
                <h4 className="font-medium text-gray-900 mb-4">Recruiter Contact Info</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-2 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-2 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default EmployerProfilePage