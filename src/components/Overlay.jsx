import React from "react";
import { atom, useAtom } from "jotai";
import { Experience } from "./Experience";

export const slideAtom = atom(0);

export const Overlay = () => {
  const [slide, setSlide] = useAtom(slideAtom);

  return (
    <div>
      <button onClick={() => setSlide(0)}>Show McQueen</button>
      <button onClick={() => setSlide(1)}>Show Cruz</button>
      <button onClick={() => setSlide(2)}>Show Storm</button>
      <Experience />
    </div>
  );
};
