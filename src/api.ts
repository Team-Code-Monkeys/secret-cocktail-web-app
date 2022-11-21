export const API_URL = process.env.NODE_ENV === 'production' ? 'https://secret-cocktail-server.herokuapp.com' : 'http://localhost:8080';
export const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyCpHG9-94DvB3FDFYLX8weS0QgyxNDESiQ';
export const GOOGLE_GEOCODING_API_KEY = process.env.GOOGLE_GEOCODING_API_KEY || 'AIzaSyCpHG9-94DvB3FDFYLX8weS0QgyxNDESiQ';
