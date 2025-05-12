//const { MusicBrainzApi } = require('musicbrainz-api');
//import { MusicBrainzApi } from 'musicbrainz-api';
const { MusicBrainzApi } = require('musicbrainz-api');


const config = {
    // Optional: MusicBrainz bot account credentials
    // botAccount: {
    //     username: 'myUserName_bot',
    //     password: 'myPassword',
    // },

    // Optional: API base URL (default: 'https://musicbrainz.org')
    baseUrl: 'https://musicbrainz.org',

    // Required: Application details
    appName: 'Tuned',
    appVersion: '0.1.0',
    appContactInfo: 'charlieney@gmail.com',

    // Optional: Proxy settings (default: no proxy server)
    // proxy: {
    //     host: 'localhost',
    //     port: 8888,
    // },

    // Optional: Disable rate limiting (default: false)
    // disableRateLimiting: false,
};

const mbApi = new MusicBrainzApi(config);

async function getArtistInfo() {
    try {
        const artist = await mbApi.lookup('artist', 'ab2528d9-719f-4261-8098-21849222a0f2', ['recordings']);
        return artist;
    } catch (err) {
        console.error('Error fetching artist:', err);
        return null;
    }

}

module.exports = { getArtistInfo };