import React, { createContext, useContext, useState } from 'react';

const SelectionContext = createContext({
  selectedObject: null,
  setSelectedObject: () => {},
});

export const useSelection = () => useContext(SelectionContext);

export const SelectionProvider = ({ children }) => {
  const [selectedObject, setSelectedObject] = useState(null);

  return (
    <SelectionContext.Provider value={{ selectedObject, setSelectedObject }}>
      {children}
    </SelectionContext.Provider>
  );
};
