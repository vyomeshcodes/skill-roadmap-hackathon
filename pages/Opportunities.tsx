
import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, DollarSign, ExternalLink, Filter, Search } from 'lucide-react';

const JOBS = [
  { title: 'Senior IoT Architect', company: 'AgriSense Systems', location: 'Remote / Berlin', salary: '$120k - $160k', type: 'Full-time', tags: ['Python', 'MQTT', 'AgriTech'] },
  { title: 'HealthData Scientist', company: 'Nova Healthcare', location: 'San Francisco, CA', salary: '$140k - $190k', type: 'On-site', tags: ['R', 'PyTorch', 'HIPAA'] },
  { title: 'Smart Grid Engineer', company: 'UrbanGrid Labs', location: 'London, UK', salary: '£80k - £110k', type: 'Hybrid', tags: ['Go', 'Rust', 'Infrastructure'] },
  { title: 'Lead AI Developer', company: 'Mediscan AI', location: 'Remote', salary: '$130k - $175k', type: 'Contract', tags: ['Computer Vision', 'PyTorch'] },
];

const Opportunities = () => {
  return (
    <div className="max-w-6xl mx-auto py-6">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-1">Opportunity Board</h2>
          <p className="text-zinc-500">Curated roles matching your {JOBS.length * 4}% skill alignment.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
            <input 
              type="text" 
              placeholder="Search roles..." 
              className="bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm text-zinc-300 outline-none focus:border-blue-500"
            />
          </div>
          <button className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {JOBS.map((job, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="glass p-8 rounded-3xl border-zinc-800 group hover:border-blue-500/30 transition-all hover:shadow-2xl hover:shadow-blue-500/5"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{job.title}</h3>
                <p className="text-sm font-semibold text-zinc-400 flex items-center gap-2">
                  <Briefcase size={14} className="text-blue-500" />
                  {job.company}
                </p>
              </div>
              <div className="p-3 bg-zinc-900 rounded-2xl text-blue-500 border border-zinc-800">
                <ExternalLink size={20} />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
                <MapPin size={14} />
                {job.location}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
                <DollarSign size={14} />
                {job.salary}
              </div>
              <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded-full uppercase">
                {job.type}
              </span>
            </div>

            <div className="flex items-center justify-between border-t border-zinc-800 pt-6">
              <div className="flex gap-2">
                {job.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-mono text-zinc-600 uppercase font-bold">{tag}</span>
                ))}
              </div>
              <button className="text-sm font-bold text-white group-hover:underline underline-offset-4 decoration-blue-500">
                View Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Opportunities;
