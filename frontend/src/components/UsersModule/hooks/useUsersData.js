import { useState, useEffect } from 'react';
import * as usersApi from '../api/usersApi';

const useUsersData = () => {
  const [usersList, setUsersList] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const fetchData = async () => {
    try {
      const data = await usersApi.fetchUsers();
      setUsersList(data);
    } catch (error) {
      console.error("Error in useUsersData:", error);
    }
  };

  const fetchUser = async () => {
    try {
      const userData = await usersApi.fetchCurrentUser();
      setLoggedInUser(userData);
    } catch (error) {
      console.error("Error in fetchUser:", error);
    }
  }

  useEffect(() => {
    fetchUser();
    fetchData();
  }, []);

  return { usersList, loggedInUser, refreshUsers: fetchData };
};

export default useUsersData;
