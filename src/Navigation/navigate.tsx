/**
 * navigate function which pushes a location to the history stack and dispatches a new popstate event
 */
const navigate = (location : string) => {
    window.history.pushState({}, "", location);
    const navigationEvent = new PopStateEvent("popstate");
    window.dispatchEvent(navigationEvent);
}

export default navigate;