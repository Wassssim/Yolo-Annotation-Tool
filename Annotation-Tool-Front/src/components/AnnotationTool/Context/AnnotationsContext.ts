import { createContext } from 'react';

const annotationsContext = createContext({
    shapes: [],
    image: null,
    background: HTMLImageElement
});

export default annotationsContext;