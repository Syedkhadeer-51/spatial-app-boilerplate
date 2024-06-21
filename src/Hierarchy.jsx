import React, { useState, useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import ReactDOM from 'react-dom/client';
import MeshSelection from './meshselection';

const HierarchyItem = React.forwardRef(({ name, children, onClick, isSelected, searchTerm }, ref) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleExpandCollapseClick = () => {
    setIsCollapsed(!isCollapsed);
  };

  const highlightedName = searchTerm
    ? name.replace(new RegExp(`(${searchTerm})`, 'gi'), (match) => `<mark>${match}</mark>`)
    : name;

  return (
    <div style={{ paddingLeft: '20px', marginTop: '5px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button onClick={handleExpandCollapseClick} style={{ display: 'inline-block' }}>
          {isCollapsed ? '▶' : '▼'}
        </button>
        <button
          onClick={onClick}
          style={{
            display: 'inline-block',
            marginLeft: '5px',
            width: '150px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            backgroundColor: isSelected ? '#d3d3d3' : 'transparent',
            border: 'none',
            textAlign: 'left',
            cursor: 'pointer',
            padding: '0',
            color: 'black',
          }}
          title={name} // Show full name on hover
          ref={ref}
          dangerouslySetInnerHTML={{ __html: highlightedName }}
        />
      </div>
      {!isCollapsed && <div>{children}</div>}
    </div>
  );
});

const Hierarchy = () => {
  const { scene } = useThree();
  const [hierarchy, setHierarchy] = useState([]);
  const [selectedObject, setSelectedObject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const hierarchyRefs = useRef({});

  useEffect(() => {
    if (!scene) return;

    const buildHierarchy = (object) => {
      const ref = React.createRef();
      hierarchyRefs.current[object.uuid] = ref;

      const children = object.children.map((child) => buildHierarchy(child));

      return (
        <HierarchyItem
          key={object.uuid}
          name={object.name || object.type}
          ref={ref}
          onClick={() => setSelectedObject(object)}
          isSelected={selectedObject === object}
          searchTerm={searchTerm}
        >
          {children}
        </HierarchyItem>
      );
    };

    const onChange = () => {
      const hierarchyStructure = buildHierarchy(scene);
      setHierarchy(hierarchyStructure);

      const sidebarContainer = document.getElementById('hierarchy');
      if (sidebarContainer) {
        const root = ReactDOM.createRoot(sidebarContainer);
        root.render(hierarchyStructure);
      } else {
        console.log('Sidebar container not found');
      }
    };

    scene.addEventListener('change', onChange);
    onChange();

    return () => {
      scene.removeEventListener('change', onChange);
    };
  }, [scene, selectedObject, searchTerm]);

  useEffect(() => {
    const handleSearch = (event) => {
      if (event.key === 'Enter') {
        const searchTerm = event.target.value.toLowerCase();
        setSearchTerm(searchTerm);

        for (const ref of Object.values(hierarchyRefs.current)) {
          if (ref.current && ref.current.innerText.toLowerCase().includes(searchTerm)) {
            ref.current.click();
            ref.current.style.backgroundColor = '#FFFF00'; // Highlight
          } else if (ref.current) {
            ref.current.style.backgroundColor = 'transparent'; // Remove highlight if not matched
          }
        }
      }
    };

    const searchbarContainer = document.getElementById('searchbar');
    if (searchbarContainer) {
      const searchbar = (
        <input
          type="text"
          placeholder="Search..."
          onKeyDown={handleSearch}
          style={{ marginBottom: '10px', width: '100%', padding: '5px' }}
        />
      );
      const root = ReactDOM.createRoot(searchbarContainer);
      root.render(searchbar);
    } else {
      console.log('Searchbar container not found');
    }
  }, []);

  return <MeshSelection selectedObject={selectedObject} />;
};

export default Hierarchy;
