import axios from 'axios';

export const API_URL = 'http://localhost:8080/api';

export const INSTAGRAM_URL = 'https://www.instagram.com';

const API = axios.create({
  baseURL: API_URL,
});

export const getInfluencerProfile = async (username) => {
  const { data } = await API.get(`/influencer/${username}`);
  return data.data;
};