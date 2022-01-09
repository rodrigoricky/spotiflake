'use strict';

// ———————— Import Packages
const chalk      = require('chalk');
const clear      = require('clear');
const figlet     = require('figlet');
const inquirer   = require('inquirer');
const CLI        = require('clui');
const Spinner    = CLI.Spinner;
const ora        = require('ora');
const meow       = require('meow');
const Conf       = require('conf');
const {Signale}  = require('signale');
const os 	 = require('os')
const fs 	 = require('fs')

// ———————— Package Configurations
const status     = ora('Loading ...');
const config     = new Conf();

const options    = { disabled: false, interactive: false, logLevel: 'info', scope: 'Information', secrets: [], stream: process.stdout, types: { information: { color: 'yellow', label: 'Welcome!', logLevel: 'info' }}};
const custom     = new Signale(options);
const fileName   = 'Spotiflake';

// ———————— Import Sub-Files
const spotifyApi = require('./lib/spotify.js')
const pkg        = require('./package.json');
const files      = require('./lib/files');

clear();

// ——  Main App UI Design
console.log(chalk.yellow( figlet.textSync(fileName, { horizontalLayout: 'full' })) + '');
console.log(chalk.white(' ———————————————————————————————————————————————————————————————— ') + '\n');
custom.information(`Thank you for using Spotiflake! Created by Ricky Rodrigo\n`); 
console.log('OS default directory for temp files : ' + os.homedir());
const path = './file.txt'

fs.access(path, fs.F_OK, (err) => {
  if (err) {
    console.log('lol')
    return
  }

  //file exists
})





/*
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
It's called "${playlistName}"


Created by Ricky Rodrigo`));
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
*/
