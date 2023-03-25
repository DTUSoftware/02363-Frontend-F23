import React from "react";

// Build using inspiration from https://dev.to/franciscomendes10866/create-your-own-react-router-53ng
const Link = ({ to, children, className } : { to : string, children : string, className? : string}) => {
  const preventReload = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    window.history.pushState({}, "", to);
    const navigationEvent = new PopStateEvent("navigate");
    window.dispatchEvent(navigationEvent);
  };
  if (className !== undefined) {
    return (
      <a href={to} onClick={preventReload}>
          <button className={className}>
              {children}
          </button>
      </a>
    );
  } else {
    return (
      <a href={to} onClick={preventReload}>
        {children}
      </a>
    );
  }
};

export default Link;