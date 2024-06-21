import React, { useState } from 'react';

const MeshGrouping = ({ hierarchyRefs, createGroup, deleteGroup }) => {
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [groupName, setGroupName] = useState('');

  const handleItemClick = (uuid, event) => {
    if (event.shiftKey) {
      setSelectedItems((prev) => {
        const newSelectedItems = new Set(prev);
        if (newSelectedItems.has(uuid)) {
          newSelectedItems.delete(uuid);
        } else {
          newSelectedItems.add(uuid);
        }
        return newSelectedItems;
      });
    }
  };

  const handleCreateGroup = () => {
    if (groupName && selectedItems.size > 0) {
      createGroup(groupName, Array.from(selectedItems));
      setGroupName('');
      setSelectedItems(new Set());
    }
  };

  const handleDeleteGroup = (groupName) => {
    deleteGroup(groupName);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Group Name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
      <button onClick={handleCreateGroup}>Create Group</button>
      <div>
        <h3>Groups:</h3>
        {Object.keys(hierarchyRefs.current).map((key) => (
          <div
            key={key}
            onClick={(e) => handleItemClick(key, e)}
            style={{
              cursor: 'pointer',
              backgroundColor: selectedItems.has(key) ? 'lightblue' : 'transparent',
            }}
          >
            {hierarchyRefs.current[key].current?.innerText}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeshGrouping;
