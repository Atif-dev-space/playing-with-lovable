
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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

interface ProjectFormProps {
  onProjectAdded: (project: Project) => void;
  editingProject?: Project | null;
  onProjectUpdated?: (project: Project) => void;
  onCancel?: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ 
  onProjectAdded, 
  editingProject, 
  onProjectUpdated, 
  onCancel 
}) => {
  const [title, setTitle] = useState(editingProject?.title || '');
  const [description, setDescription] = useState(editingProject?.description || '');
  const [status, setStatus] = useState(editingProject?.status || 'Planning');
  const [priority, setPriority] = useState(editingProject?.priority || 'Medium');
  const [category, setCategory] = useState(editingProject?.category || 'Web Development');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const projectData = {
      id: editingProject?.id || Date.now().toString(),
      title,
      description,
      status,
      priority,
      category,
      createdAt: editingProject?.createdAt || new Date().toISOString(),
      userId: editingProject?.userId || '1'
    };

    if (editingProject && onProjectUpdated) {
      onProjectUpdated(projectData);
    } else {
      onProjectAdded(projectData);
    }

    // Reset form if not editing
    if (!editingProject) {
      setTitle('');
      setDescription('');
      setStatus('Planning');
      setPriority('Medium');
      setCategory('Web Development');
    }
  };

  return (
    <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-white/20">
      <CardHeader>
        <CardTitle className="text-xl text-gray-800 dark:text-gray-200">
          {editingProject ? 'Edit Project' : 'Add New Project'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Project Title
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="bg-white/50 dark:bg-gray-700/50 border-white/20"
              placeholder="Enter project title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="bg-white/50 dark:bg-gray-700/50 border-white/20"
              placeholder="Describe your project"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2 rounded-md bg-white/50 dark:bg-gray-700/50 border border-white/20 text-gray-800 dark:text-gray-200"
              >
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full p-2 rounded-md bg-white/50 dark:bg-gray-700/50 border border-white/20 text-gray-800 dark:text-gray-200"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 rounded-md bg-white/50 dark:bg-gray-700/50 border border-white/20 text-gray-800 dark:text-gray-200"
              >
                <option value="Web Development">Web Development</option>
                <option value="Mobile App">Mobile App</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Research">Research</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {editingProject ? 'Update Project' : 'Add Project'}
            </Button>
            {editingProject && onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProjectForm;
