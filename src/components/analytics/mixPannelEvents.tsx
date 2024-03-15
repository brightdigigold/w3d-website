

export const MixPannelEvents = (event_name: string, properties: {}) => {
    console.log("event_name", event_name)
    console.log("properties", properties)
    
    try {
        console.log('event_name, properties', event_name, properties)
        if ((window as any).mixpanel) {
            (window as any).mixpanel.track(event_name, properties);
            console.log('fall in try')
        }
    } catch (e) {
        console.log(e);
    }
}
