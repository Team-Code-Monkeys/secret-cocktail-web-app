export const API_URL = process.env.NODE_ENV === 'production' ? 'https://us-central1-secret-cocktail.cloudfunctions.net/app' : 'http://127.0.0.1:5001/secret-cocktail/us-central1/app';
export const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'AIzaSyAxAi1EsechS9MWXOHhY53u2JthptfPN1g';
export const GOOGLE_GEOCODING_API_KEY = process.env.REACT_APP_GOOGLE_GEOCODING_API_KEY || 'AIzaSyAxAi1EsechS9MWXOHhY53u2JthptfPN1g';
