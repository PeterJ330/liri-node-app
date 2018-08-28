require("dotenv").config();
var divider = "\n------------------------------------------------------------\n";

var liri = {
    request: require("request"),
    inquirer: require("inquirer"),
    fs: require("fs"),
    keys: require("./keys"),
    moment: require("moment"),
    Spotify: require("node-spotify-api"),
    searchType: process.argv[2],
    userInput: "",
    formatUserInput: function () {
        for (var i = 3; i < process.argv.length; i++) {
            this.userInput += process.argv[i] + " ";
        }
        this.userInput = this.userInput.trim().replace(/ /g, "+");
        console.log(this.userInput);
    },
    //closes formatUserInput function
    concertSearch: function () {
        this.formatUserInput();
        if (this.userInput === "") {
            this.userInput = "Justin+Timberlake";
        }
        var url = "https://rest.bandsintown.com/artists/" + this.userInput + "/events?app_id=codingbootcamp";

        this.request(url, function (err, response, body) {
            if (err) {
                console.log(err);
            } else {
                var output = JSON.parse(body)
                // console.log(response);

                console.log(divider);
                output.forEach(function (a) {

                    console.log('');
                    console.log('Venue: ' + a.venue.name);
                    console.log('Location: ' + a.venue.city + ', ' + a.venue.region)
                    console.log('Date: ' + liri.moment(a.datetime).format('MM/DD/YYYY'));

                })
            }

        })
    },
    songSearch: function () {
        this.formatUserInput();
        if (this.userInput === "" || this.userInput === " ") {
            this.userInput = "the+sign+ace+of+base";
        }
        var spotify = new this.Spotify(this.keys.spotify);

        spotify.search({
            type: "track",
            query: this.userInput,
            limit: 1
        },
            function (err, response) {
                if (err) {
                    console.log(err);
                } else {
                    var output = response.tracks.items[0];
                    console.log("\n");
                    console.log(output.name);
                    console.log("Artist: " + output.artists[0].name);
                    console.log("Album: " + output.album.name);
                    console.log("Preview: " + output.preview_url);
                    console.log(divider);
                }
            });
    }, //closes songSearch function

    movieSearch: function () {
        this.formatUserInput();
        if (this.userInput === "") {
            this.userInput = "Mr.+Nobody";
        }
        var url = "http://www.omdbapi.com/?t=" + this.userInput + "&y=&plot=short&apikey=trilogy";
        console.log(url);

        this.request(url, function (error, response, body) {
            if (!error && response.statusCode === 200) {  
                var output = JSON.parse(body);
                console.log("\n");
                console.log("Title: "  + output.Title);
                console.log("Year Released: " + output.Year);
                console.log("IMDB Rating: " + output.imdbRating);
                console.log("Rotten Tomatoes Rating: "+ output.Ratings[1].Value);
                console.log("Country: " + output.Country);
                console.log("Language: " + output.Language);
                console.log("Plot: " + output.Plot);
                console.log("Cast: " + output.Actors);
                console.log(divider);
            }
        });
    }

}; //closes liri object


// runs functions based on user search type
if (process.argv[2] === "concert-this") {
    liri.concertSearch();
} else if (process.argv[2] === "spotify-this-song") {
    liri.songSearch();
} else if (process.argv[2] === "movie-this") {
    liri.movieSearch();
} else if (process.argv[2] === "do-what-it-says") {
    liri.randomAction();
}