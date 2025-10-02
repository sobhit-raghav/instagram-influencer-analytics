import axios from 'axios';

export const API_URL = 'https://instagram-influencer-analytics-production.up.railway.app/api';

export const INSTAGRAM_URL = 'https://www.instagram.com';

const API = axios.create({
  baseURL: API_URL,
});

export const getInfluencerProfile = async (username) => {
  const { data } = await API.get(`/influencer/${username}`);
  return data.data;
};