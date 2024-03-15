

export const MixPannelEvents = (event_name: string, properties: {}) => {
    console.log("event_name", event_name)
    console.log("properties", properties)
    
    try {
        if ((window as any).mixpanel) {
            (window as any).mixpanel.track(event_name, properties);
        }
    } catch (e) {
        console.log(e);
    }
}
