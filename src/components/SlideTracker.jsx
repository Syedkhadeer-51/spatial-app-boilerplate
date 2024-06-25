import { useEffect } from 'react';
import { useAtom,atom } from 'jotai';
import { slideAtom } from './Experience';
import { scenes } from './Experience'; // Assuming scenes is imported from './Experience'

// Custom atom to track scenes array length
const scenesLengthAtom = atom(get => scenes.length);

export const SlideTracker = () => {
    const [slide, setSlide] = useAtom(slideAtom);
    const [scenesLength] = useAtom(scenesLengthAtom);

    // Effect to handle changes in scenes length
    useEffect(() => {
        // When scenes length changes, reset slide to 0
        setSlide(slide);
    }, [scenesLength, setSlide]);

    const handlePageChange = (pageNumber) => {
        setSlide(pageNumber);
    };

    return (
        <>
            {scenes.map((scene, index) => (
                <button
                    key={index}
                    className={`pages-button ${slide === index ? 'active' : ''}`}
                    onClick={() => handlePageChange(index)}
                >
                    {index + 1}
                </button>
            ))}
        </>
    );
};
