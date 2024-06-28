import React, { useRef } from 'react';
import { gridColor } from './atoms';
import { backgroundColor } from './atoms';
import { useAtom } from 'jotai';
import { gridHelperRefAtom } from './atoms';
function BackgroundColorWithGrid() {
    // Your component logic here
    const gridHelperRef = useRef(null);
    const[,setGridHelperRef]  = useAtom(gridHelperRefAtom);
    setGridHelperRef(gridHelperRef);
    const [BackgroundColor,setBackgroundColor] = useAtom(backgroundColor);
    const [GridColor,setGridColor] = useAtom(gridColor);

    return (
        <>
        <color attach="background" args={[BackgroundColor]} />
        <gridHelper ref={gridHelperRef} args={[20, 20, GridColor, GridColor]} />
        </>
    );
}

export default BackgroundColorWithGrid;