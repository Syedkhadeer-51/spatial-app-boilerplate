import React, { useEffect, useState } from "react";
import { atom, useAtom } from "jotai";
import { scenes } from "./Experience";
import leftArrow from "../assets/left-arrow.svg"; // Adjust the path to your SVG file
import rightArrow from "../assets/right-arrow.svg"; // Adjust the path to your SVG file
import logo from "../assets/logo.svg"; // Adjust the path to your SVG file
import "../index.css";

export const slideAtom = atom(0);
export const homeAtom = atom(false);
export const dispAtom = atom(true);

export const Overlay = () => {
  const [slide, setSlide] = useAtom(slideAtom); //represents current slide indext
  const [displaySlide, setDisplaySlide] = useState(slide); //index of slide to be displayed
  const [visible, setVisible] = useState(false); //visibility of overlay
  
  //delayed fade in effect for overlay
  useEffect(() => {
    setTimeout(() => {
      setVisible(true);
    }, 1000);
  }, []);

  //slide transition
  useEffect(() => {
    setVisible(false);
    setTimeout(() => {
      setDisplaySlide(slide);
      setVisible(true);
    }, 2000);
  }, [slide]);





  return (
    <div className={`overlay ${visible ? "visible" : "invisible"}`}>

      <>
        <div className="nav-bar">
          <div className="nav-left">
            <a href="https://www.google.com/" className="nav-link">Import From Device</a>
            <a href="https://www.google.com/" className="nav-link">Export To Device</a>
          </div>
          <img src={logo} alt="Logo" className="logo" />
          <div className="nav-right">
            <div className="dropdown">
              <button className="dropbtn">Import From FireBase</button>
              <div class="dropdown-content">
              <a href="#">Link 1</a>
              <a href="#">Link 2</a>
              <a href="#">Link 3</a>
              </div>
            </div>
            
            <a href="https://www.google.com/" className="nav-link">Export From FireBase</a>
          </div>
        </div>

        <div className="nav">
          <img
            src={leftArrow}
            alt="Previous Slide"
            className="nav-button"
            onClick={() =>
              setSlide((prev) => (prev > 0 ? prev - 1 : scenes.length - 1))
            }
          />
          <img
            src={rightArrow}
            alt="Next Slide"
            className="nav-button"
            onClick={() =>
              setSlide((prev) => (prev < scenes.length - 1 ? prev + 1 : 0))
            }
          />
        </div>
        <div className="content">
          <h1 className="title">{scenes[displaySlide].name}</h1>
        </div>
      </>
    </div>
  );
};
