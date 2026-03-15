require('dotenv').config();
const dns = require('dns');
dns.setServers(['1.1.1.1']);
const mongoose = require('mongoose');
const Movie = require('./Movies');

const movies = [
    {
        title: 'Inception',
        releaseDate: 2010,
        genre: 'Science Fiction',
        actors: [
            { actorName: 'Leonardo DiCaprio', characterName: 'Cobb' },
            { actorName: 'Joseph Gordon-Levitt', characterName: 'Arthur' },
        ],
    },
    {
        title: 'The Dark Knight',
        releaseDate: 2008,
        genre: 'Action',
        actors: [
            { actorName: 'Christian Bale', characterName: 'Bruce Wayne' },
            { actorName: 'Heath Ledger', characterName: 'Joker' },
        ],
    },
    {
        title: 'The Shawshank Redemption',
        releaseDate: 1994,
        genre: 'Drama',
        actors: [
            { actorName: 'Tim Robbins', characterName: 'Andy Dufresne' },
            { actorName: 'Morgan Freeman', characterName: 'Ellis Boyd Redding' },
        ],
    },
    {
        title: 'The Silence of the Lambs',
        releaseDate: 1991,
        genre: 'Thriller',
        actors: [
            { actorName: 'Jodie Foster', characterName: 'Clarice Starling' },
            { actorName: 'Anthony Hopkins', characterName: 'Hannibal Lecter' },
        ],
    },
    {
        title: 'The Princess Bride',
        releaseDate: 1987,
        genre: 'Adventure',
        actors: [
            { actorName: 'Cary Elwes', characterName: 'Westley' },
            { actorName: 'Robin Wright', characterName: 'Buttercup' },
        ],
    },
];

mongoose.connect(process.env.DB)
    .then(async () => {
        console.log('Connected to MongoDB');
        await Movie.insertMany(movies);
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
