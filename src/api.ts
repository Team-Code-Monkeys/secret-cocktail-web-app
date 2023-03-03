export const API_URL = process.env.NODE_ENV === 'production' ? 'https://us-central1-secret-cocktail.cloudfunctions.net/api' : 'http://127.0.0.1:5001/secret-cocktail/us-central1/api';
export const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'AIzaSyCpHG9-94DvB3FDFYLX8weS0QgyxNDESiQ';
export const GOOGLE_GEOCODING_API_KEY = process.env.REACT_APP_GOOGLE_GEOCODING_API_KEY || 'AIzaSyCpHG9-94DvB3FDFYLX8weS0QgyxNDESiQ';
