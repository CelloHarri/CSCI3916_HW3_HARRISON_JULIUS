let envPath = __dirname + "/../.env";
require('dotenv').config({ path: envPath });
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let User = require('../Users');
let Movie = require('../Movies');
chai.should();

chai.use(chaiHttp);

const testData = {
    user: {
        name: 'test2',
        username: 'email2@email.com',
        password: '123@abc'
    },
    movie: {
        title: 'Alice in Wonderland',
        releaseDate: 2010,
        genre: 'Fantasy',
        actors: [
            { actorName: 'Mia Wasikowska', characterName: 'Alice Kingsleigh' },
            { actorName: 'Johnny Depp', characterName: 'Mad Hatter' },
            { actorName: 'Helena Bonham Carter', characterName: 'Red Queen' }
        ]
    }
};


let token = '';

describe('Test Movie Routes', () => {
    before(async () => {
        try {
            await Promise.all([
                User.deleteOne({ name: 'test2' }),
                Movie.deleteOne({ title: 'Alice in Wonderland' })
            ]);
        } catch (error) {
            console.error("Error in setup:", error);
            throw error;
        }
    });

    describe('/signup and authentication', () => {
        it('should register user, login, and get token', async () => {
            const signupRes = await chai.request(server)
                .post('/signup')
                .send(testData.user);

            signupRes.should.have.status(201);
            signupRes.body.success.should.be.eql(true);

            const signinRes = await chai.request(server)
                .post('/signin')
                .send(testData.user);

            signinRes.should.have.status(200);
            signinRes.body.should.have.property('token');
            token = signinRes.body.token;
        });
    });

    describe('Movie Operations', () => {
        it('should add a new movie', async () => {
            const res = await chai.request(server)
                .post('/movies')
                .set('Authorization', token)
                .send(testData.movie);

            res.should.have.status(201);
            res.body.should.be.an('object');
            res.body.should.have.property('movie');
            res.body.movie.should.have.property('title', testData.movie.title);
        });

        it('should retrieve all movies', async () => {
            const res = await chai.request(server)
                .get('/movies')
                .set('Authorization', token);

            res.should.have.status(200);
            res.body.message.should.be.an('array');
            res.body.message.should.have.length.of.at.least(1);

            const addedMovie = res.body.message.find(m => m.title === testData.movie.title);
            addedMovie.should.have.property('genre', testData.movie.genre);
        });

        it('should return 400 when saving a movie with no actors', async () => {
            const res = await chai.request(server)
                .post('/movies')
                .set('Authorization', token)
                .send({ title: "No Actors", releaseDate: "2000", genre: "Adventure" });

            res.should.have.status(400);
            res.body.success.should.be.eql(false);
        });

        it('should return 400 when saving a movie with no title', async () => {
            const res = await chai.request(server)
                .post('/movies')
                .set('Authorization', token)
                .send({ releaseDate: "2000", genre: "Adventure", actors: [{ actorName: "Bob", characterName: "Paul" }] });

            res.should.have.status(400);
            res.body.success.should.be.eql(false);
        });
    });

    after(async () => {
        try {
            await Promise.all([
                User.deleteOne({ name: 'test2' }),
                Movie.deleteOne({ title: 'Alice in Wonderland' })
            ]);
        } catch (error) {
            console.error("Error in cleanup:", error);
            throw error;
        }
    });
});