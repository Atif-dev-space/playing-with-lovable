
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import ProjectList from './ProjectList';
import ProjectForm from './ProjectForm';
import { Project } from '../hooks/useProjects';

interface AdminDashboardProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
  onProjectUpdated: (project: Project) => void;
  loading: boolean;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  projects,
  onEdit,
  onDelete,
  onProjectUpdated,
  loading
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'All' || project.status === filterStatus;
    const matchesPriority = filterPriority === 'All' || project.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    onEdit(project);
  };

  const handleProjectUpdated = (project: Project) => {
    setEditingProject(null);
    onProjectUpdated(project);
  };

  const handleCancel = () => {
    setEditingProject(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Get statistics
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const inProgressProjects = projects.filter(p => p.status === 'In Progress').length;
  const highPriorityProjects = projects.filter(p => p.priority === 'High' || p.priority === 'Critical').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage all projects and users across the platform
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-white/20">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-blue-600">{totalProjects}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Projects</div>
          </CardContent>
        </Card>
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-white/20">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-green-600">{completedProjects}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
          </CardContent>
        </Card>
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-white/20">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-yellow-600">{inProgressProjects}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
          </CardContent>
        </Card>
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-white/20">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-red-600">{highPriorityProjects}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">High Priority</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-white/20">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800 dark:text-gray-200">
            Filter & Search Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Search Projects
              </label>
              <Input
                type="text"
                placeholder="Search by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/50 dark:bg-gray-700/50 border-white/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-2 rounded-md bg-white/50 dark:bg-gray-700/50 border border-white/20 text-gray-800 dark:text-gray-200"
              >
                <option value="All">All Statuses</option>
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Filter by Priority
              </label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full p-2 rounded-md bg-white/50 dark:bg-gray-700/50 border border-white/20 text-gray-800 dark:text-gray-200"
              >
                <option value="All">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Form */}
      {editingProject && (
        <ProjectForm
          editingProject={editingProject}
          onProjectUpdated={handleProjectUpdated}
          onCancel={handleCancel}
          onProjectAdded={() => {}} // Not used in edit mode
        />
      )}

      {/* Projects List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            All Projects ({filteredProjects.length})
          </h2>
        </div>
        <ProjectList
          projects={filteredProjects}
          onEdit={handleEdit}
          onDelete={onDelete}
          isAdmin={true}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
