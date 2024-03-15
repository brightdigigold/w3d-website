

export const MixPannelEvents = (event_name: string, properties: {}) => {

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