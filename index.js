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

// Function to request location (for demonstration purposes)
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

// get location detail using lat and long 
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

// Register the service worker on page load
window.addEventListener('load', () => {
    registerServiceWorker();

    // For demonstration purposes, get the location on button click
    const getLocationButton = document.getElementById('getLocationButton');
    if (getLocationButton) {
        getLocationButton.addEventListener('click', getLocation);
    }
});

function getNotification() {
    Notification.requestPermission((result) => {
        console.log('user choice', result)
        if(result !== 'granted'){
            console.log('No notification  permission granted!')
        }
        else{
        if ('PushManager' in window && navigator.serviceWorker) {
            // Ensure the service worker is ready
        navigator.serviceWorker.ready.then(registration => {
            registration.active.postMessage({
                type: 'trigger-push-notification',
                payload: {
                    title: 'Custom Push Notification',
                    options: {
                        body: 'This is the body of the push notification.',
                        icon: '/icon.png'
                    }
                }
            });
        });
    } else {
        console.error('Push notifications are not supported by this browser.');
    }
}
})
}

