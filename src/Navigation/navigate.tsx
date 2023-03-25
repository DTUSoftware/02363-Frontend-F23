
const navigate = (to : string) => {
    window.history.pushState({}, "", to);
    const navigationEvent = new PopStateEvent("navigate");
    window.dispatchEvent(navigationEvent);
}

export default navigate;