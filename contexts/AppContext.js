import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [newPosts, setNewPosts] = useState([]);


  const addNewPost = (newPost) => {
    setNewPosts([newPost, ...newPosts]);
  };

  return (
    <AppContext.Provider value={{ addNewPost, newPosts}}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
