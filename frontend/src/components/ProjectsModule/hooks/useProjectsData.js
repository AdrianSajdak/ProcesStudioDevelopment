import { useState, useEffect } from 'react';
import { fetchUserRole, fetchClients, fetchProjects, getPhasesForProject } from '../api/projectsApi';

export default function useProjectsData() {
  const [userRole, setUserRole] = useState(null);
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [phasesByProject, setPhasesByProject] = useState({});

  useEffect(() => {
    fetchUserRole()
      .then((data) => {
        setUserRole(data.role);
      })
      .catch((err) => console.error('Error fetching user role:', err));

    refreshProjects();
    refreshClients();
  }, []);

  const refreshProjects = () => {
    fetchProjects()
      .then((data) => setProjects(data))
      .catch((err) => console.error('Error fetching projects:', err));
  };

  const refreshClients = () => {
    fetchClients()
      .then((data) => setClients(data))
      .catch((err) => console.error('Error fetching clients:', err));
  };

  const fetchPhasesForProject = (projectId) => {
    return getPhasesForProject(projectId)
      .then((data) => {
        setPhasesByProject((prev) => ({ ...prev, [projectId]: data }));
        return data;
      })
      .catch((err) => {
        console.error('Error fetching phases:', err);
        return [];
      });
  };

  return {
    userRole,
    projects,
    clients,
    phasesByProject,
    refreshProjects,
    refreshClients,
    fetchPhasesForProject,
    setPhasesByProject,
  };
}