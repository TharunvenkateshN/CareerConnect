import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Building2, MapPin, Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import axiosInstance from '../../utils/axiosInstance'
import DashboardLayout from '../../components/layout/DashboardLayout'
import moment from 'moment'

const AppliedJobs = () => {
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axiosInstance.get('/api/applications/my')
                setApplications(response.data || [])
            } catch (error) {
                console.error('Error fetching applications:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchApplications()
    }, [])

    const getStatusColor = (status) => {
        switch (status) {
            case 'Accepted':
                return 'bg-green-100 text-green-800'
            case 'Rejected':
                return 'bg-red-100 text-red-800'
            case 'In Review':
                return 'bg-yellow-100 text-yellow-800'
            default:
                return 'bg-blue-100 text-blue-800'
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Accepted':
                return <CheckCircle className="w-4 h-4 mr-1" />
            case 'Rejected':
                return <XCircle className="w-4 h-4 mr-1" />
            case 'In Review':
                return <Clock className="w-4 h-4 mr-1" />
            default:
                return <FileText className="w-4 h-4 mr-1" />
        }
    }

    return (
        <DashboardLayout activeMenu="applied-jobs">
            <div className="max-w-4xl mx-auto p-6">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Applied Jobs</h1>
                    <p className="text-gray-600">Track the status of your job applications</p>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm animate-pulse h-32"></div>
                        ))}
                    </div>
                ) : applications.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">No applications yet</h3>
                        <p className="text-gray-600 mb-6">Start exploring jobs and apply to positions that match your skills.</p>
                        <Link
                            to="/find-jobs"
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Find Jobs
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {applications.map((app) => (
                            <div key={app._id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            {app.job.company?.companyLogo ? (
                                                <img src={app.job.company.companyLogo} alt={app.job.company.companyName} className="w-8 h-8 object-contain" />
                                            ) : (
                                                <Building2 className="w-6 h-6 text-gray-400" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">
                                                <Link to={`/job/${app.job._id}`} className="hover:text-blue-600 transition-colors">
                                                    {app.job.title}
                                                </Link>
                                            </h3>
                                            <p className="text-gray-600">{app.job.company?.companyName || "Company"}</p>
                                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                                                <span className="flex items-center">
                                                    <MapPin className="w-4 h-4 mr-1" />
                                                    {app.job.location}
                                                </span>
                                                <span className="flex items-center">
                                                    <Calendar className="w-4 h-4 mr-1" />
                                                    Applied {moment(app.createdAt).fromNow()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                                            {getStatusIcon(app.status)}
                                            {app.status}
                                        </span>
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

export default AppliedJobs
