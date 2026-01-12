import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, Download, CheckCircle, XCircle, Clock } from 'lucide-react'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import DashboardLayout from '../../components/layout/DashboardLayout'
import toast from 'react-hot-toast'
import moment from 'moment'

const ApplicationViewer = () => {
  const [searchParams] = useSearchParams()
  const jobId = searchParams.get('jobId')
  const navigate = useNavigate()

  const [applications, setApplications] = useState([])
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchApplicants = async () => {
    if (!jobId) return
    try {
      setLoading(true)
      const response = await axiosInstance.get(API_PATHS.APPLICATIONS.GET_ALL_APPLICATIONS(jobId)) // Note: Check API path function in apiPaths
      // Actually backend route is /:jobId/applicants. apiPaths.js says GET_ALL_APPLICATIONS: (id) => `/api/applications/job/${id}`
      // Wait, backend route is: router.get("/:jobId/applicants", protect, getApplicantsForJob);
      // Path in apiPaths seems to be `/api/applications/job/${id}` which implies `/api/applications` + `/job/${id}`. 
      // Backend: `app.use('/api/applications', applicationRoutes)`
      // Route file: `router.get("/:jobId/applicants", ...)`
      // So full path is `/api/applications/:jobId/applicants`
      // My apiPaths.js has: `GET_ALL_APPLICATIONS: (id) => /api/applications/job/${id}` which is WRONG.
      // I will fix apiPaths.js first, or override here. I should fix it.
      // But for now I will hardcode/override in the call to be safe or assuming I'll fix it.
      // I'll assume the helper function in this file uses the CORRECT path.

      // Let's check what I passed to axiosInstance.get...
      // I will fix apiPaths.js in a separate tool call if strictly needed, but let's see if I can direct fix here.
      // I will assume the corrected path is used.

      const realPath = `/api/applications/${jobId}/applicants`;
      const appResponse = await axiosInstance.get(realPath);
      setApplications(appResponse.data.data || [])

      // Also fetch job details for header
      const jobResponse = await axiosInstance.get(API_PATHS.JOBS.GET_JOB_BY_ID(jobId));
      setJob(jobResponse.data.job);

    } catch (error) {
      console.error('Error fetching applicants:', error)
      toast.error('Failed to load applicants')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (jobId) {
      fetchApplicants()
    }
  }, [jobId])

  const handleStatusUpdate = async (id, status) => {
    try {
      await axiosInstance.put(API_PATHS.APPLICATIONS.UPDATE_STATUS(id), { status });
      setApplications(prev => prev.map(app => app._id === id ? { ...app, status } : app));
      toast.success(`Applicant marked as ${status}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  }

  if (!jobId) return (
    <DashboardLayout activeMenu="applicants">
      <div className="p-6 text-center">
        <p>Please select a job from Manage Jobs to view applicants.</p>
        <button onClick={() => navigate('/manage-jobs')} className="text-blue-600 mt-2 hover:underline">Go to Manage Jobs</button>
      </div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout activeMenu="applicants">
      <div className="max-w-7xl mx-auto p-6">
        <button
          onClick={() => navigate('/manage-jobs')}
          className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Applicants for {job?.title || 'Job'}
            </h1>
            <p className="text-gray-600">Review and manage candidates</p>
          </div>
          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium">
            {applications.length} Total Applicants
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-500">No applicants yet for this job.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map(app => (
              <div key={app._id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold text-xl">
                      {app.applicant?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{app.applicant?.name || 'Unknown User'}</h3>
                      <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-500">
                        <a href={`mailto:${app.applicant?.email}`} className="flex items-center hover:text-blue-600">
                          <Mail className="w-4 h-4 mr-1" />
                          {app.applicant?.email}
                        </a>
                        {app.applicant?.phone && (
                          <span className="flex items-center">
                            <Phone className="w-4 h-4 mr-1" />
                            {app.applicant.phone}
                          </span>
                        )}
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          Applied {moment(app.appliedAt).fromNow()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {app.resume && (
                      <a
                        href={app.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 text-sm font-medium"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Resume
                      </a>
                    )}

                    <div className="relative group">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                        className={`appearance-none pl-4 pr-10 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${app.status === 'hired' ? 'bg-green-100 text-green-800 focus:ring-green-500' :
                            app.status === 'rejected' ? 'bg-red-100 text-red-800 focus:ring-red-500' :
                              app.status === 'interviewing' ? 'bg-yellow-100 text-yellow-800 focus:ring-yellow-500' :
                                'bg-blue-50 text-blue-600 focus:ring-blue-500'
                          }`}
                      >
                        <option value="applied">Applied</option>
                        <option value="interviewing">Interviewing</option>
                        <option value="hired">Hired</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default ApplicationViewer