import { useState, useEffect } from 'react';
import * as profileApi from '../api/profileApi';

const useProfileData = () => {
  const [userData, setUserData] = useState(null);

  const fetchUser = async () => {
    try {
      const data = await profileApi.fetchProfile();
      setUserData(data);
    } catch (error) {
      console.error("Error in useProfileData:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { userData, refreshProfile: fetchUser };
}

export default useProfileData;