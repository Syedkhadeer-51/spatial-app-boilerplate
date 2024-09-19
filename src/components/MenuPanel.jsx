import { scenes } from './Experience';
import { atom, useAtom } from 'jotai';
import { scenesAtom, slideAtom } from './Experience';
import '../menu.css';

export const animateAtom = atom(false);       
export const TexturesMaterialsAtom = atom(false);
export const LightsAtom = atom(false);

export const MenuPanel = () => {
  const [slide, setSlide] = useAtom(slideAtom);
  const [TexturesMaterials, setTexturesMaterials] = useAtom(TexturesMaterialsAtom);
  const [Light, setLights] = useAtom(LightsAtom);

  const handleDelete = (index) => {
    if (scenes.length > 1) {
      const confirmDeletion = window.confirm("Are you sure you want to delete this model?");
      if (confirmDeletion) {
        scenes.splice(index, 1);
        setSlide((prev) => (prev < scenes.length - 1 ? prev + 1 : 0));
      }
    } else {
      alert("Cannot delete the last remaining model.");
    }
  };

  return (
    <>
      <div id="wrapper">
          <header>
            <div className="iconDiv" tooltip="Lights" tabIndex="0" onClick={()=>{setLights(!Light); setTexturesMaterials(false);}} style={{ backgroundColor: Light ? 'rgb(221, 82, 82)' : 'transparent' }}>
              <div className="iconSVG">
              <svg fill="#f5f0f0" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 472.586 472.586" xmlSpace="preserve" stroke="#f5f0f0"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M236.308,141.894c-52.058,0-94.413,42.356-94.413,94.413s42.356,94.413,94.413,94.413s94.413-42.356,94.413-94.413 S288.365,141.894,236.308,141.894z M236.308,311.029c-41.202,0-74.721-33.519-74.721-74.721s33.519-74.721,74.721-74.721 s74.721,33.519,74.721,74.721S277.51,311.029,236.308,311.029z"></path> </g> </g> <g> <g> <rect x="226.462" width="19.692" height="104.635"></rect> </g> </g> <g> <g> <rect x="96.367" y="53.889" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -43.9906 106.2113)" width="19.692" height="104.636"></rect> </g> </g> <g> <g> <rect y="226.462" width="104.635" height="19.692"></rect> </g> </g> <g> <g> <rect x="53.866" y="356.542" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -227.9753 182.3956)" width="104.636" height="19.692"></rect> </g> </g> <g> <g> <rect x="226.462" y="367.951" width="19.692" height="104.635"></rect> </g> </g> <g> <g> <rect x="356.539" y="314.082" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -151.7719 366.3898)" width="19.692" height="104.636"></rect> </g> </g> <g> <g> <rect x="367.951" y="226.462" width="104.635" height="19.692"></rect> </g> </g> <g> <g> <rect x="314.098" y="96.36" transform="matrix(0.7071 -0.7071 0.7071 0.7071 32.2216 290.2019)" width="104.636" height="19.692"></rect> </g> </g> </g></svg>
              </div>
            </div>
            <div className="iconDiv" tooltip="Textures & Materials" tabIndex="0" onClick={()=>{setTexturesMaterials(!TexturesMaterials); setLights(false);}} style={{ backgroundColor: TexturesMaterials ? 'rgb(221, 82, 82)' : 'transparent' }}>
              <div className="iconSVG">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#e0e0e0"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" stroke="#e0e0e0" strokeWidth="1.08" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke="#e0e0e0" strokeWidth="1.08" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
              </div>
            </div>
            <div className="spacer"></div>
            <div className="divider"></div>
            <div className="iconDiv" tooltip="Delete" tabIndex="0" onClick={()=> handleDelete(slide)}>
              <div className="iconSVG">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9.17065 4C9.58249 2.83481 10.6937 2 11.9999 2C13.3062 2 14.4174 2.83481 14.8292 4" stroke="#e0e0e0" strokeWidth="1.2" strokeLinecap="round"></path> <path d="M20.5 6H3.49988" stroke="#e0e0e0" strokeWidth="1.2" strokeLinecap="round"></path> <path d="M18.3735 15.3991C18.1965 18.054 18.108 19.3815 17.243 20.1907C16.378 21 15.0476 21 12.3868 21H11.6134C8.9526 21 7.6222 21 6.75719 20.1907C5.89218 19.3815 5.80368 18.054 5.62669 15.3991L5.16675 8.5M18.8334 8.5L18.6334 11.5" stroke="#e0e0e0" strokeWidth="1.2" strokeLinecap="round"></path> <path d="M9.5 11L10 16" stroke="#e0e0e0" strokeWidth="1.2" strokeLinecap="round"></path> <path d="M14.5 11L14 16" stroke="#e0e0e0" strokeWidth="1.2" strokeLinecap="round"></path> </g></svg>
              </div>
            </div>
          </header>
        </div>
    </>
  );
};
