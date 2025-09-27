import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
});

export const getInfluencerProfile = async (username) => {
  const { data } = await API.get(`/influencer/${username}`);
  return data;
};

export const getPosts = async (username) => {
  const { data } = await API.get(`/posts/${username}`);
  return data;
};

export const getReels = async (username) => {
  const { data } = await API.get(`/reels/${username}`);
  return data;
};