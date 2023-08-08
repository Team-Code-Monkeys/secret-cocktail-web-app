**Required Environment Variables for the App**

These are environment variables that must be defined for the App to run properly. Create an ``api.ts`` file with the following content in the ``src`` folder:


```shell
export const API_URL = process.env.NODE_ENV === 'production' ? '...' : '...';
export const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '...';
export const GOOGLE_GEOCODING_API_KEY = process.env.REACT_APP_GOOGLE_GEOCODING_API_KEY || '...';
```

``GOOGLE_MAPS_API_KEY`` and ``GOOGLE_GEOCODING_API_KEY`` are the api key assigned by google cloud console for the map api. The api must be added to the project as it does not come stock. It can be done at the "https://console.cloud.google.com/apis/dashboard" for your project's name. 

``API_URL`` is the URL Twilio will make requests to in order to progress the phone survey. This can be set to the production URL ``"https://us-central1-secret-cocktail.cloudfunctions.net/app"``.

