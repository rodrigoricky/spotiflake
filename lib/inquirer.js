const inquirer = require('inquirer');
const Conf = require('conf');
const config = new Conf();

module.exports = {
  askSpotifyCredentials: () => {
     inquirer.prompt([
      {
        name: 'artist',
        type: 'input',
        message: 'Enter an artist name:',
        validate: function( value ) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter a valid artist name, for example: Twice';
          }
        }
      },
      {
        name: 'username',
        type: 'input',
        message: 'Enter your Spotify username:',
        validate: function( value ) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter a correct Spotify username. To get your username, just copy the word inside the Your Username box : https://open.spotify.com/user/[Your Username]';
          }
        }
      },
      {
        name: 'password',
        type: 'password',
        message: 'Enter your Spotify bearer token:',
        validate: function(value) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter your Spotify bearer token. To get your bearer token, open this link : https://developer.spotify.com/console/post-playlists/';
          }
        }
      }
   ]).then(function(answers) {
         var answer = JSON.stringify(answers);
         config.set(answers);
         resolve(true);
      }).catch(err => reject(err));
  },
};