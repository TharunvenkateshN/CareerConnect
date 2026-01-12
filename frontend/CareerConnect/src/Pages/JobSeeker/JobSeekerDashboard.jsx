import React, { useState, useEffect } from 'react'
import { Search, MapPin, Filter, X } from 'lucide-react'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import JobCard from '../../components/Cards/JobCard'
import DashboardLayout from '../../components/layout/DashboardLayout'
import toast from 'react-hot-toast'

const JobSeekerDashboard = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    jobType: '',
    experienceLevel: '',
    location: ''
  })
  const [showFilters, setShowFilters] = useState(false)
  const [savedJobs, setSavedJobs] = useState([])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(API_PATHS.JOBS.GET_ALL_JOBS)
      setJobs(response.data || [])
    } catch (error) {
      console.error('Error fetching jobs:', error)
      toast.error('Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }

  const fetchSavedJobs = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.SAVE_JOB.GET_SAVED_JOBS)
      setSavedJobs((response.data || []).map(item => item.job._id))
    } catch (error) {
      console.log('Error fetching saved jobs', error)
    }
  }

  const handleSaveJob = async (jobId) => {
    // Demo Mode
    if (['1', '2', '3'].includes(jobId)) {
      if (savedJobs.includes(jobId)) {
        setSavedJobs(prev => prev.filter(id => id !== jobId));
        toast.success('Job removed (Demo)');
      } else {
        setSavedJobs(prev => [...prev, jobId]);
        toast.success('Job saved (Demo)');
      }
      return;
    }

    try {
      const isSaved = savedJobs.includes(jobId)
      if (isSaved) {
        await axiosInstance.delete(API_PATHS.SAVE_JOB.UNSAVE_JOB(jobId))
        setSavedJobs(prev => prev.filter(id => id !== jobId))
        toast.success('Job removed from saved list')
      } else {
        await axiosInstance.post(API_PATHS.SAVE_JOB.SAVE_JOB(jobId))
        setSavedJobs(prev => [...prev, jobId])
        toast.success('Job saved successfully')
      }
    } catch (error) {
      toast.error('Failed to update saved jobs')
    }
  }

  useEffect(() => {
    fetchJobs()
    fetchSavedJobs()
  }, [])

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company?.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = !filters.jobType || job.jobType === filters.jobType
    const matchesExp = !filters.experienceLevel || job.experienceLevel === filters.experienceLevel
    const matchesResult = matchesSearch && matchesType && matchesExp

    return matchesResult
  })

  return (
    <DashboardLayout activeMenu="find-jobs">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Find Your Dream Job</h1>
          <p className="text-gray-600">Browse thousands of job openings from top companies</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by job title or company..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center px-4 py-2 border rounded-lg transition-colors ${showFilters || filters.jobType || filters.experienceLevel
                ? 'bg-blue-50 text-blue-600 border-blue-200'
                : 'border-gray-200 hover:bg-gray-50'
                }`}
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </button>
          </div>

          {/* Expanded Filters */}
          {(showFilters || filters.jobType || filters.experienceLevel) && (
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                className="p-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500"
                value={filters.jobType}
                onChange={(e) => setFilters(prev => ({ ...prev, jobType: e.target.value }))}
              >
                <option value="">All Job Types</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
                <option value="Internship">Internship</option>
              </select>

              <select
                className="p-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500"
                value={filters.experienceLevel}
                onChange={(e) => setFilters(prev => ({ ...prev, experienceLevel: e.target.value }))}
              >
                <option value="">All Experience Levels</option>
                <option value="Entry Level">Entry Level</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior Level">Senior Level</option>
              </select>

              <button
                onClick={() => setFilters({ jobType: '', experienceLevel: '', location: '' })}
                className="text-sm text-red-500 hover:text-red-700 font-medium"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Job List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map(job => (
              <JobCard
                key={job._id}
                job={job}
                isSaved={savedJobs.includes(job._id)}
                onSave={handleSaveJob}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
            <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
            <p className="text-gray-500 mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default JobSeekerDashboard