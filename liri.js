var fs = require("fs");
var keys = require("./keys");
var inquirer = require("inquirer");
var spotify = require('spotify');
var Twitter = require('twitter');
var request = require("request");

fs.readFile("keys.js", "utf8", function (error, data) {
})

// Ask the user to make a choice:
inquirer.prompt([
    {
        type: "list",
        message: "What would you like to do?",
        choices: ["Check my tweets", "Look up a song", "Check out a movie", "Something else"],
        name: "choice"
    },

    // Do something with their response:

]).then(function (user) {

    // If they choose checking their twitter:

    if (user.choice == "Check my tweets") {
        var client = new Twitter(keys.twitterKeys);

        // Return tweets with date stamp:
        var params = { screen_name: '@SkokiaanNJ' };
        client.get('statuses/user_timeline', params, function (error, tweets, response) {
            if (!error) {
                for (var i = 0; i < 20; i++)
                    console.log((tweets[i].created_at) + "\n    " + (tweets[i]).text);
                fs.appendFile("log.txt", (tweets[i].created_at) + "\n    " + (tweets[i]).text);
            }
        })  // end client.get

        // If they choose to look up a song:

    } else if (user.choice == "Look up a song") {

        // Ask the user for a song title:
        inquirer.prompt([
            {
                type: "input",
                message: "Choose a song: ",
                name: "song"
            },

        ]).then(function (songChoice) {

            // If no choice is made, force this song upon them:
            if (songChoice.song == "") {
                songChoice.song = "The Sign Ace of Base";
            }  

            spotify.search({ type: 'track', query: songChoice.song }, function (err, data) {
                if (err) {
                    console.log('Error occurred: ' + err);
                    return;
                }
                else
                    var title = data.tracks.items[0].name;
                var preview = data.tracks.items[0].preview_url;
                var artist = data.tracks.items[0].artists[0].name;
                var album = data.tracks.items[0].album.name;

                console.log("\nArtist Name: " + data.tracks.items[0].artists[0].name);
                console.log("Title: " + JSON.stringify(title, null, 2));
                console.log("Preview Link: " + JSON.stringify(preview, null, 2));
                console.log("Album Name: " + album);

                fs.appendFile("log.txt", title + "\n" + artist + "\n" + album + "\n" + preview + "\n");
            });
        })  // end then songChoice 
    }  // end 'song else-if'

    // If user chooses a movie:
    else if (user.choice == "Check out a movie") {

        // Ask the user for a movie title:
        inquirer.prompt([
            {
                type: "input",
                message: "Pick a movie: ",
                name: "movie"
            },

        ]).then(function (movieChoice) {

            // If no movie is chosen, they are stuck with "Mr. Nobody"
            if (movieChoice.movie == "") {
                movieChoice.movie = "Mr. Nobody";
            }

            request("http://www.omdbapi.com/?t=" + movieChoice.movie + "&y=&plot=short&r=json&tomatoes=true", function (error, response, body) {

                // If the request is successful (response status code is 200)
                if (!error && response.statusCode === 200) {

                    console.log("\nTitle: " + JSON.parse(body).Title);
                    console.log("Year: " + JSON.parse(body).Year);
                    console.log("imdb Rating rating: " + JSON.parse(body).imdbRating);
                    console.log("Country: " + JSON.parse(body).Country);
                    console.log("Language: " + JSON.parse(body).Language);
                    console.log("Actors: " + JSON.parse(body).Actors);
                    console.log("Rotten Tomatoes rating: " + JSON.parse(body).Ratings[1].Value);
                    console.log("Rotten Tomatoes URL: " + JSON.parse(body).tomatoURL);
                    console.log("\nPlot: " + JSON.parse(body).Plot);

                    fs.appendFile("log.txt", ("\nTitle: " + JSON.parse(body).Title) + ("\nYear: " + JSON.parse(body).Year) + ("\nimdb Rating rating: " + JSON.parse(body).imdbRating) + ("\nCountry: " + JSON.parse(body).Country) + ("\nLanguage: " + JSON.parse(body).Language) + ("\nActors: " + JSON.parse(body).Actors) + ("\nRotten Tomatoes rating: " + JSON.parse(body).Ratings[1].Value) + ("\nRotten Tomatoes URL: " + JSON.parse(body).tomatoURL) + ("\nPlot: " + JSON.parse(body).Plot));
                } // end if
            })
        })
    } // end movie

    else if (user.choice == "Something else") {
        fs.readFile("./random.txt", "utf8", function (error, data) {
            if (!error) {
                somethingElse = data.split(",");
                // console.log(somethingElse[1]);

                spotify.search({ type: 'track', query: somethingElse }, function (err, data) {
                    // console.log(data);
                    // var title = data.tracks.items[0].name;
                    // var preview = data.tracks.items[0].preview_url;
                    // var artist = data.tracks.items[0].artists[0].name;
                    // var album = data.tracks.items[0].album.name;

                    console.log("\nArtist Name: " + data.tracks.items[0].artists[0].name);
                    console.log("Title: " + JSON.stringify(title, null, 2));
                    console.log("Preview Link: " + JSON.stringify(preview, null, 2));
                    console.log("Album Name: " + album);

                    fs.appendFile("log.txt", title + "\n" + artist + "\n" + album + "\n" + preview + "\n");
                })

            }
        })
    };

}); // end 
