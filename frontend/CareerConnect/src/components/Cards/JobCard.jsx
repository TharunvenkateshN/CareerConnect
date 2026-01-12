import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Clock, DollarSign, Building2, Bookmark, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import moment from 'moment'

const JobCard = ({ job, onSave, isSaved }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
        >
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            {job.company?.logo ? (
                                <img src={job.company.logo} alt={job.company.name} className="w-8 h-8 object-contain" />
                            ) : (
                                <Building2 className="w-6 h-6 text-gray-400" />
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {job.title}
                            </h3>
                            <p className="text-sm text-gray-500">{job.company?.name || "Company Confidential"}</p>
                        </div>
                    </div>
                    {onSave && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                onSave(job._id);
                            }}
                            className={`p-2 rounded-full hover:bg-gray-50 transition-colors ${isSaved ? 'text-blue-600 fill-current' : 'text-gray-400'
                                }`}
                        >
                            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                        </button>
                    )}
                </div>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-2" />
                        {job.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                        <DollarSign className="w-4 h-4 mr-2" />
                        ${job.salary?.min?.toLocaleString()} - ${job.salary?.max?.toLocaleString()} / year
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-2" />
                        {moment(job.createdAt).fromNow()}
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                        {job.jobType}
                    </span>
                    <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                        {job.experienceLevel}
                    </span>
                </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                    {job.applicants?.length || 0} Applicants
                </span>
                <Link
                    to={`/job/${job._id}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center"
                >
                    View Details
                    <ArrowUpRight className="w-4 h-4 ml-1" />
                </Link>
            </div>
        </motion.div>
    )
}

export default JobCard
