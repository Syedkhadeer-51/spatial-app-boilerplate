import React from 'react';
import { gridColor } from './atoms';
import { backgroundColor } from './atoms';
import { useAtom } from 'jotai';
function BackgroundColorWithGrid({gridHelperRef}) {
    // Your component logic here
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