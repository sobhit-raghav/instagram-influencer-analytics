import axios from 'axios';

export const API_URL = 'http://localhost:8080/api';

const API = axios.create({
  baseURL: API_URL,
});

export const getInfluencerProfile = async (username) => {
  const { data } = await API.get(`/influencer/${username}`);
  return data.data;
};