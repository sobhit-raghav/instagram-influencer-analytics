import axios from 'axios';

const API = axios.create({
  baseURL: 'https://instagram-influencer-analytics-backend.onrender.com/api',
});

export const getInfluencerProfile = async (username) => {
  const { data } = await API.get(`/influencer/${username}`);
  return data.data;
};

export const getPosts = async (username) => {
  const { data } = await API.get(`/posts/${username}`);
  return data.data; 
};

export const getReels = async (username) => {
  const { data } = await API.get(`/reels/${username}`);
  return data.data;
};