
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Project {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  category: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchProjects = async () => {
    if (!user) {
      setProjects([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        return;
      }

      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (projectData: Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([
          {
            ...projectData,
            user_id: user.id,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error adding project:', error);
        return;
      }

      setProjects([data, ...projects]);
      return data;
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating project:', error);
        return;
      }

      setProjects(projects.map(p => p.id === id ? data : p));
      return data;
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting project:', error);
        return;
      }

      setProjects(projects.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user]);

  return {
    projects,
    loading,
    addProject,
    updateProject,
    deleteProject,
    refetch: fetchProjects,
  };
};
