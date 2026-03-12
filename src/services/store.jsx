import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getUsers, addUser } from './db.js';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    const data = await getUsers();
    setUsers(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchUsers();

    // Listen for cross-component DB updates
    const handleDbUpdate = () => {
      fetchUsers();
    };

    window.addEventListener('db_updated', handleDbUpdate);
    return () => window.removeEventListener('db_updated', handleDbUpdate);
  }, [fetchUsers]);

  const registerUser = async (userData) => {
    const newUser = await addUser(userData);
    return newUser;
  };

  return (
    <StoreContext.Provider value={{ users, isLoading, registerUser }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
