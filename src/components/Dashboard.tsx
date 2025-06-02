
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './Navbar';
import ProjectForm from './ProjectForm';
import ProjectList from './ProjectList';
import AdminDashboard from './AdminDashboard';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  createdAt: string;
  userId: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Load projects from localStorage on component mount
  useEffect(() => {
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  // Save projects to localStorage whenever projects change
  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  const handleProjectAdded = (project: Project) => {
    setProjects([...projects, project]);
    setShowForm(false);
  };

  const handleProjectUpdated = (updatedProject: Project) => {
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
    setEditingProject(null);
    setShowForm(false);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDelete = (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(p => p.id !== projectId));
    }
  };

  const handleCancel = () => {
    setEditingProject(null);
    setShowForm(false);
  };

  const userProjects = user?.role === 'admin' ? projects : projects.filter(p => p.userId === user?.id);

  const renderContent = () => {
    if (currentPage === 'admin' && user?.role === 'admin') {
      return (
        <AdminDashboard
          projects={projects}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onProjectUpdated={handleProjectUpdated}
        />
      );
    }

    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-white/20">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-600">{userProjects.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Projects</div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-white/20">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">
                {userProjects.filter(p => p.status === 'Completed').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-white/20">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-yellow-600">
                {userProjects.filter(p => p.status === 'In Progress').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-white/20">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-red-600">
                {userProjects.filter(p => p.priority === 'High' || p.priority === 'Critical').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">High Priority</div>
            </CardContent>
          </Card>
        </div>

        {/* Add Project Button */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            My Projects
          </h2>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {showForm ? 'Hide Form' : 'Add Project'}
          </Button>
        </div>

        {/* Project Form */}
        {showForm && (
          <ProjectForm
            onProjectAdded={handleProjectAdded}
            editingProject={editingProject}
            onProjectUpdated={handleProjectUpdated}
            onCancel={handleCancel}
          />
        )}

        {/* Project List */}
        <ProjectList
          projects={userProjects}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
