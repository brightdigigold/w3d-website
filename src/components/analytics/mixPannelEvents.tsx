export const MixPannelEvents = (event_name: string, properties: {}, callback?: () => void) => {
    
    try {
        console.log('event_name, properties', event_name, properties)
        if ((window as any).mixpanel) {
            (window as any).mixpanel.track(event_name, properties);
        } else if (callback) {
            callback(); // Invoke the callback if provided
        }
    } catch (e) {
        console.log(e);
    }
}