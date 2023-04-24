
const navigate = (to : string) => {
    window.history.pushState({}, "", to);
    const navigationEvent = new PopStateEvent("popstate");
    window.dispatchEvent(navigationEvent);
}

export default navigate;