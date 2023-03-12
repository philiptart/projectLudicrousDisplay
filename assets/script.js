var Wroot = "https://en.wikipedia.org/w/api.php" //root URL
var Wquery= "?action=query&format=json&prop=extracts%7Cinfo&list=search&formatversion=2&srsearch=" //Query parameters before search term
var Wformat ="%20FC&srnamespace=0&srlimit=1"//formatting after search term also adds FC (football club) to the inital search
var Wsearch = "";//blank variable to be overwritten in WikiQuery but remain globally available
var Wtitle ="" //the title of the wiki article
var WextractLength ="4" //extract length (in full sentences)

var WikiQuery = function(Wteamname){ //Function to build query friendly term from the search term 
    var Wsearcharray = Wteamname.split(" ") //removes the spaces from the search term
    Wsearch = Wsearcharray.join("%20") //puts in the characters to represent a space "%20" and recombines into Wsearch 
    return Wsearch; //returns usable search term
}

var Wfetch = function(Wterm){ //function to fetch results from wiki API including the search term 
    WikiQuery(Wterm) //convert the term using WikiQuery into a usable Wsearch variable
    var WrequestURL= Wroot+Wquery+Wsearch+Wformat //combines the root, query and search into the required URL
    fetch(WrequestURL) //get the data using the request url
        .then(function(response){
            return response.json(); //parses the response
        })
        .then(function(response){
            Wtitle=response.query.search[0].title //gets the title of the page found in the search
            var WtitleQ = WikiQuery(Wtitle) //converts the title into a string that can be used in a query 
            fetch(Wroot+"?action=query&format=json&prop=extracts&titles="+WtitleQ+"&formatversion=2&exsentences="+WextractLength) //fetches the page result using the slightly different query parameters and variable extract length
                .then(function(response){
                    return response.json();//parse response
                })
                .then(function(response){
                    Wtext.innerHTML=response.query.pages[0].extract //p element under team name gets the extract from wiki API, using innerHTML to keep tags from wiki article where lists, headings or other items are part of the extract
                })

        }
        )

}


var matches = document.getElementsByTagName("h2") //element that contains idividual matches into an array
   for(let i=0;i<matches.length;i++){ //for loop to apply to each element (team)
        matches[i].addEventListener("click",function(event){ //listens for clicks on team 
            var search = event.target.innerHTML  //reads the team title from the h2 element
            Wtext = event.target.nextElementSibling //saves the element below the h2 (the p tag) in a Wtext variable
            if(Wtext.innerHTML=="Additional Team info from wikipedia"){ //if the Wtext is the default,
            Wfetch(search) //fetch with the search term from h2 element
            } else { //if the html content is not the default
                Wtext.innerHTML="Additional Team info from wikipedia" //make it the default - clear it away -
            }
        })
    }

