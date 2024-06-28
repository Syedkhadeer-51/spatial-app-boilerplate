import { atom } from "jotai";

export const backgroundColor = atom('#3b3b3b');

export const gridColor = atom('#ffffff');

export const cameraNames = atom({});

export const activeCamera = atom('defaults');

export const selectedCamera = atom('defaults');

export const modelPath = atom(null);

export const exports = atom(false);

export const toCloud = atom(false);

export const inputModelUrl = atom('');

export const modelUrls=atom([]);

export const gridHelperRefAtom = atom(null);
