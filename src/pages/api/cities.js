// pages/api/cities.js
import citiesData from './data/cities.json';

export default (req, res) => {
    res.status(200).json(citiesData);
};
