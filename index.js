// Function to register the service worker
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker-cf.js')
        // navigator.serviceWorker.register('/service-worker-co.js')
        // navigator.serviceWorker.register('/service-worker-nf.js')
        // navigator.serviceWorker.register('/service-worker-no.js')
        // navigator.serviceWorker.register('/service-worker-swr.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.error('Error registering Service Worker:', error);
            });
    }
}

function getLocation() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(position => {
            getExactLocation(position.coords.latitude, position.coords.longitude)
        }, error => {
            console.error('Error getting location:', error);
        });
    } else {
        console.error('Geolocation is not supported in this browser.');
    }
}

async function getExactLocation(lat, long) {
    try{
        const apiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}&localityLanguage=en`
            const response = await fetch(apiUrl);
            const data = await response.json()
            console.log(data)
    }catch(e){
        console.error(e)
    }
}

window.addEventListener('load', () => {
    registerServiceWorker();
});

function getNotification() {
    Notification.requestPermission((result) => {
        console.log('user choice', result)
        if(result !== 'granted'){
            console.log('No notification  permission granted!')
        }
        else{
        if ('PushManager' in window && navigator.serviceWorker) {
        navigator.serviceWorker.ready.then(registration => {
            registration.active.postMessage({
                type: 'trigger-push-notification',
                payload: {
                    title: 'Custom Push Notification',
                    body: 'This is the body of the push notification.',
                }
            });
        });
    } else {
        console.error('Push notifications are not supported by this browser.');
    }
}
})
}

