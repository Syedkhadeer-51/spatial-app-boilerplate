import { scenes } from "./Experience"
import { useAtom } from 'jotai';
import { slideAtom } from "./Experience";


export const SlideTracker = ()=>{
    const [slide, setSlide] = useAtom(slideAtom);
    const handlePageChange = (pageNumber) => {
        setSlide(pageNumber);
      };
    return(
        <>
            {scenes.map((scene, index)=>(
                <button
                    key={index}
                    className={`pages-button ${slide === index?'active':''}`}
                    onClick={()=> handlePageChange(index)}
                >
                    {index+1}
                </button>
            ))}
        </>
    )
}