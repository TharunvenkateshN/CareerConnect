import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Edit2, Trash2, Eye, MoreHorizontal, Power, Briefcase } from 'lucide-react'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import DashboardLayout from '../../components/layout/DashboardLayout'
import toast from 'react-hot-toast'
import moment from 'moment'

const ManageJobs = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(API_PATHS.JOBS.GET_JOBS_EMPLOYER)
      setJobs(response.data || [])
    } catch (error) {
      console.error('Error fetching jobs:', error)
      toast.error('Failed to load your jobs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await axiosInstance.delete(API_PATHS.JOBS.DELETE_JOB(id));
      setJobs(prev => prev.filter(job => job._id !== id));
      toast.success("Job deleted successfully");
    } catch (error) {
      toast.error("Failed to delete job");
    }
  }

  const handleToggleClone = async (id) => {
    try {
      await axiosInstance.put(API_PATHS.JOBS.TOGGLE_CLOSE(id));
      setJobs(prev => prev.map(job => job._id === id ? { ...job, isClosed: !job.isClosed } : job));
      toast.success("Job status updated");
    } catch (error) {
      toast.error("Failed to update status");
    }
  }

  return (
    <DashboardLayout activeMenu="manage-jobs">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Jobs</h1>
            <p className="text-gray-600">View and manage your job listings</p>
          </div>
          <Link
            to="/post-job"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Post New Job
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 font-semibold text-gray-700">Job Title</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Date Posted</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Applicants</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading jobs...</td>
                  </tr>
                ) : jobs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No jobs posted yet.</td>
                  </tr>
                ) : (
                  jobs.map(job => (
                    <tr key={job._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <Link to={`/job/${job._id}`} className="font-medium text-gray-900 hover:text-blue-600">
                          {job.title}
                        </Link>
                        <p className="text-xs text-gray-500">{job.location}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {moment(job.createdAt).format("MMM Do, YYYY")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="bg-blue-100 text-blue-700 py-1 px-3 rounded-full text-xs font-semibold">
                            {job.applicants?.length || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${!job.isClosed
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}>
                          {!job.isClosed ? 'Active' : 'Closed'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-3">
                          <Link
                            to={`/applicants?jobId=${job._id}`} // Or logic to show applicants
                            className="text-gray-400 hover:text-blue-600 tooltip"
                            title="View Applicants"
                          >
                            <Eye className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => handleToggleClone(job._id)}
                            className="text-gray-400 hover:text-orange-600"
                            title={job.isActive ? "Close Job" : "Reopen Job"}
                          >
                            <Power className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(job._id)}
                            className="text-gray-400 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ManageJobs