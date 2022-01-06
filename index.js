'use strict';
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const files = require('./lib/files');
const inquirer  = require('inquirer');
const CLI = require('clui');
const Spinner = CLI.Spinner;
const ora = require('ora');
const status = ora('Loading ...');
const spotifyApi = require('./lib/spotify.js')
const pkg = require('./package.json');
const meow = require('meow');

const Conf = require('conf');
const config = new Conf();

clear();

console.log(
  chalk.yellow(
    figlet.textSync('Spotiflake', { horizontalLayout: 'full' })
  )
);

function auth() {
   return new Promise((resolve, reject) => {
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
   });
}

const spotiflake = async function spotiflake(inputs, flags) {

   
   const artistName = config.get('artist');

   let playlistName = `${artistName}: SpotiFlake`;
    
   status.start();
   var allTracks = [];
   var artists = [];
   var relatedTracks = []

   let token = config.get('password')
   // const artistSearch = await 
   spotifyApi.searchArtists(artistName, token).then(res => {
         if (res.artists.items[0] === undefined) {
            status.fail('Failed');
            config.clear();
            console.log(chalk.red(`
	
		Oops! That search didn't work. Try again please!
			`))
            process.exit()
         }
         let artistID = res.artists.items[0].id;
         spotifyApi.getArtistTopTracks(artistID, token).then(res => {
            for (let artistTrack of res.tracks) {
               allTracks.push(artistTrack.uri);
            }
            spotifyApi.getArtistRelatedArtists(artistID, token).then(res => {
               for (var i = 0; i < 5; i++) {
                  if (res.artists[i] !== undefined) {
                     artists.push(res.artists[i].id);
                  }
               }

               for (let i = 0; i < Math.min(artists.length, 5); i++) {
                  spotifyApi.getArtistTopTracks(artists[i], token).then(res => {
                     for (let artistTrack of res.tracks) {
                        relatedTracks.push(artistTrack.uri);
                     }
                  })
               }

            })
         })
      }).catch(async err => {
         status.fail('Failed');
         config.clear();
         console.log(chalk.red(`
ERROR: Incorrect username or bearer token

You might need to update your bearer token

Generate a new one at https://developer.spotify.com/console/post-playlists/

Try again!`));
         process.exit()
	})

        // console.log(artistSearch.data)
   var timeout = setInterval(function() {
      if (relatedTracks.length !== 0 && allTracks.length !== 0) {
         const tracks = allTracks.concat(relatedTracks)
         clearInterval(timeout);
         // call playlist gen function using allTracks
         spotifyApi.createPlaylist(playlistName, token).then(res => spotifyApi.populatePlaylist(res.id, tracks, token).then(res => {
            status.succeed('Success!');
            console.log(chalk.green(`
Your playlist is ready! 
It's called "${playlistName}"`));
 	 config.clear();

         }))
      }
   }, 400);

	
  };

status.stop(); // like return


const cli = meow(chalk.cyan(`
    Usage
      $ spotiflake "artist_name"
      ? Enter your Spotify username <username>
      ? Enter your Spotify bearer token <bearer>

    Options
      --name [-n] "playlist name"

    Example
      $ spotiflake -a "Young Thug"
      ? Enter your Spotify username kabirvirji
      ? Enter your Spotify bearer token ************************************************************

   

`), {
   alias: {
      n: 'name'
   }
});

(async () => {
   if (config.get('username') === undefined || config.get('password') === undefined) {
           let authorization = await auth();

   }
   spotiflake(config.get('password'), cli.flags);

})();