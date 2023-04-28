import React from "react";

/**
 * Link component used to navigate between pages in the navbar
 * Returns two possible anchor elements both allowing for custom child elements and location strings
 * Build using inspiration from https://dev.to/franciscomendes10866/create-your-own-react-router-53ng
 */
const Link = ({ location, children, className } : { location : string, children : any, className? : string}) => {

  // onClick for handling anchor elements, pushes a location to the history stack and dispatches a new popstate event
  const onClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    window.history.pushState({}, "", location);
    const navigationEvent = new PopStateEvent("popstate");
    window.dispatchEvent(navigationEvent);
  };
  if (className !== undefined) {
    return (
      <a href={location} onClick={onClick}>
          <button className={className}>
              {children}
          </button>
      </a>
    );
  } else {
    return (
      <a href={location} onClick={onClick}>
        {children}
      </a>
    );
  }
};

export default Link;