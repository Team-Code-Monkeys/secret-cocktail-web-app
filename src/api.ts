export const API_URL = process.env.NODE_ENV === 'production' ? 'https://us-central1-tsc-phone-survey.cloudfunctions.net/app' : 'http://127.0.0.1:5001/tsc-phone-survey/us-central1/app';
export const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'AIzaSyATOLjzu4dudN72tlNG5-5NgNSqjWWNuxA';
export const GOOGLE_GEOCODING_API_KEY = process.env.REACT_APP_GOOGLE_GEOCODING_API_KEY || 'AIzaSyATOLjzu4dudN72tlNG5-5NgNSqjWWNuxA';
