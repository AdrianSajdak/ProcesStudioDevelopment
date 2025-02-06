import { useState, useEffect } from 'react';
import * as clientsApi from '../api/clientsApi';

const useClientsData = () => {
  const [clientsList, setClientsList] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const fetchData = async () => {
    try {
      const data = await clientsApi.fetchClients();
      setClientsList(data);
    } catch (error) {
      console.error("Error in useClientsData:", error);
    }
  };
  
  const fetchCurrentUser = async () => {
    try {
      const data = await clientsApi.getCurrentUser();
      setLoggedInUser(data);
    } catch (error) {
      console.error("Error in useClientsData:", error);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchData();
  }, []);

  return { clientsList, loggedInUser, refreshClients: fetchData };
};

export default useClientsData;