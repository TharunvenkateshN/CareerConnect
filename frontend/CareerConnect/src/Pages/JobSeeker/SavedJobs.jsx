import React, { useState, useEffect } from 'react'
import { Bookmark, Search } from 'lucide-react'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import JobCard from '../../components/Cards/JobCard'
import DashboardLayout from '../../components/layout/DashboardLayout'
import toast from 'react-hot-toast'

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchSavedJobs = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(API_PATHS.SAVE_JOB.GET_SAVED_JOBS)
      // The API returns an array of saved job objects
      setSavedJobs(response.data || [])
    } catch (error) {
      console.error('Error fetching saved jobs:', error)
      toast.error('Failed to load saved jobs')
    } finally {
      setLoading(false)
    }
  }

  const handleUnsaveJob = async (jobId) => {
    try {
      await axiosInstance.delete(API_PATHS.SAVE_JOB.UNSAVE_JOB(jobId))
      setSavedJobs(prev => prev.filter(item => item.job._id !== jobId))
      toast.success('Job removed from saved list')
    } catch (error) {
      toast.error('Failed to remove job')
    }
  }

  useEffect(() => {
    fetchSavedJobs()
  }, [])

  return (
    <DashboardLayout activeMenu="saved-jobs">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Saved Jobs</h1>
          <p className="text-gray-600">Keep track of the jobs you're interested in</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : savedJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedJobs.map(item => (
              <JobCard
                key={item._id}
                job={item.job}
                isSaved={true}
                onSave={() => handleUnsaveJob(item.job._id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
            <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Bookmark className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No saved jobs yet</h3>
            <p className="text-gray-500 mt-1">Jobs you save will appear here</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default SavedJobs