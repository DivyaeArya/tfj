import { motion } from "framer-motion";
import { Job } from "@/lib/jobs";
import { Trash2, ExternalLink } from "lucide-react";

interface JobListProps {
  jobs: Job[];
  onRemove?: (jobId: string) => void;
}

export default function JobList({ jobs, onRemove }: JobListProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (jobs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-12 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <span className="text-3xl">📋</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No saved jobs yet
        </h3>
        <p className="text-gray-600">
          Start swiping to save job opportunities!
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {jobs.map((job) => (
        <motion.div
          key={job.id}
          variants={itemVariants}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
        >
          {/* Header with logo */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
            <div className="flex items-start gap-3">
              <img
                src={job.logo}
                alt={job.company}
                className="w-12 h-12 rounded-lg object-cover border border-gray-200"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">
                  {job.title}
                </h3>
                <p className="text-sm text-gray-600">{job.company}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Location and Salary */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>📍</span>
                <span>{job.location}</span>
              </div>
              <div className="text-sm font-semibold text-blue-600">
                {job.salary}
              </div>
            </div>

            {/* Skills */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Skills
              </p>
              <div className="flex flex-wrap gap-1">
                {job.skills.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded border border-blue-200"
                  >
                    {skill}
                  </span>
                ))}
                {job.skills.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                    +{job.skills.length - 3}
                  </span>
                )}
              </div>
            </div>

            {/* Description preview */}
            <p className="text-sm text-gray-600 line-clamp-2">
              {job.description}
            </p>
          </div>

          {/* Actions */}
          <div className="p-4 bg-gray-50 border-t border-gray-200 flex gap-2">
            <a
              href={job.applyUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:shadow-md transition-shadow flex items-center justify-center gap-2"
            >
              <ExternalLink size={16} />
              Apply
            </a>
            {onRemove && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onRemove(job.id)}
                className="px-3 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors"
                title="Remove from saved"
              >
                <Trash2 size={16} />
              </motion.button>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
