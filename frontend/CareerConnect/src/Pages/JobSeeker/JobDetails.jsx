import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Building2,
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  Calendar,
  Share2,
  Bookmark,
  CheckCircle,
  ArrowLeft
} from 'lucide-react'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import DashboardLayout from '../../components/layout/DashboardLayout'
import toast from 'react-hot-toast'
import moment from 'moment'
import { useAuth } from '../../context/AuthContext'

const JobDetails = () => {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true)

        // 1. Fetch Job Details (Public)
        const jobRes = await axiosInstance.get(API_PATHS.JOBS.GET_JOB_BY_ID(jobId))
        setJob(jobRes.data.job)

        // 2. Fetch User Specific Data (Protected) - Only if logged in
        if (isAuthenticated) {
          try {
            const [savedRes, appRes] = await Promise.all([
              axiosInstance.get(API_PATHS.SAVE_JOB.GET_SAVED_JOBS),
              axiosInstance.get(API_PATHS.APPLICATIONS.GET_ALL_APPLICATIONS(jobId) + '/../my')
            ])

            const savedList = savedRes.data.data || []
            setIsSaved(savedList.some(item => item.job._id === jobId))
          } catch (authError) {
            console.warn("Could not fetch user data", authError);
          }
        }
      } catch (error) {
        console.error('Error fetching job details:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchJobDetails()
  }, [jobId, isAuthenticated])

  // Separate effect to check application status properly to avoid Promise.all failure if one fails
  useEffect(() => {
    const checkApplicationStatus = async () => {
      try {
        const response = await axiosInstance.get('/api/applications/my');
        const myApps = response.data.data || [];
        const found = myApps.find(app => app.job._id === jobId);
        if (found) setHasApplied(true);
      } catch (error) {
        console.log("Could not check application status");
      }
    }
    if (jobId) checkApplicationStatus();
  }, [jobId])


  const handleApply = async () => {

    try {
      setApplying(true)
      await axiosInstance.post(API_PATHS.APPLICATIONS.APPLY_TO_JOB(jobId))
      setHasApplied(true)
      toast.success('Application submitted successfully!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply')
    } finally {
      setApplying(false)
    }
  }

  const handleSave = async () => {

    try {
      if (isSaved) {
        await axiosInstance.delete(API_PATHS.SAVE_JOB.UNSAVE_JOB(jobId))
        setIsSaved(false)
        toast.success('Job removed from saved list')
      } else {
        await axiosInstance.post(API_PATHS.SAVE_JOB.SAVE_JOB(jobId))
        setIsSaved(true)
        toast.success('Job saved')
      }
    } catch (error) {
      toast.error('Failed to update saved status')
    }
  }

  if (loading) return (
    <DashboardLayout>
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    </DashboardLayout>
  )

  if (!job) return (
    <DashboardLayout>
      <div className="p-6 text-center">Job not found</div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout activeMenu="find-jobs">
      <div className="max-w-4xl mx-auto p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </button>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center">
                {job.company?.logo ? <img src={job.company.logo} className="w-10 h-10 object-contain" /> : <Building2 className="w-8 h-8 text-blue-600" />}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                <p className="text-lg text-gray-600 mt-1">{job.company?.name || "Confidential"}</p>
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
                  <span className="flex items-center"><MapPin className="w-4 h-4 mr-2" />{job.location}</span>
                  <span className="flex items-center"><DollarSign className="w-4 h-4 mr-2" />${job.salary?.min?.toLocaleString()} - {job.salary?.max?.toLocaleString()}</span>
                  <span className="flex items-center"><Briefcase className="w-4 h-4 mr-2" />{job.jobType}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleSave}
                className={`p-3 rounded-lg border transition-colors ${isSaved ? 'bg-blue-50 border-blue-200 text-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
              {hasApplied ? (
                <button disabled className="px-6 py-3 bg-green-50 text-green-700 rounded-lg font-medium flex items-center cursor-not-allowed">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Applied
                </button>
              ) : (
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:bg-blue-400"
                >
                  {applying ? 'Submitting...' : 'Apply Now'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Job Description</h2>
              <div className="prose prose-blue max-w-none text-gray-600 whitespace-pre-wrap">
                {job.description}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Requirements</h2>
              <div className="prose prose-blue max-w-none text-gray-600 whitespace-pre-wrap">
                {job.requirements}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Job Overview</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Posted Date</p>
                  <div className="flex items-center text-gray-900 font-medium">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {moment(job.createdAt).format('MMMM Do, YYYY')}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Experience Level</p>
                  <div className="flex items-center text-gray-900 font-medium">
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    {job.experienceLevel}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Positions</p>
                  <div className="flex items-center text-gray-900 font-medium">
                    <UsersIcon className="w-4 h-4 mr-2 text-gray-400" />
                    {job.positions} Openings
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

// Helper icons
const UsersIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
)

export default JobDetails