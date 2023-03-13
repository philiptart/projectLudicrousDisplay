var Wroot = "https://en.wikipedia.org/w/api.php" //root URL
var Wquery= "?action=query&format=json&prop=extracts%7Cinfo&list=search&formatversion=2&exchars=1000&exsentences=4&exintro=1&explaintext=1&inprop=url&srsearch=" //Query parameters before search term
var Wformat ="%20FC&srnamespace=0&srlimit=1&srprop=snippet"//formatting after search term
//https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&titles=Portugal&formatversion=2&exchars=1000
var Wsearch = "";//blank variable to be overwritten in WikiQuery but remain globally available


var WikiQuery = function(Wterm){ //Function to build query friendly term from the search term 
    var Wsearcharray = Wterm.split(" ") //removes the spaces from the search term
    Wsearch = Wsearcharray.join("%20") //puts in the characters to represent a space "%20"
    return Wsearch;
}

var Wfetch = function(Wterm){
    WikiQuery(Wterm)
    var WrequestURL= Wroot+Wquery+Wsearch+Wformat //combines the root, query and search into the required URL
    console.log(WrequestURL)
    fetch(WrequestURL) //get the data
        .then(function(response){
            return response.json();
        })
        .then(function(response){
            Wtext.innerHTML=response.query.search[0].snippet+"..." // print snippet- needs to be replaced 
        }
        )

}
Wfetch("Manchester United")

var matches = document.getElementsByTagName("h2") //element that contains idividual matches
console.log(matches)
   for(let i=0;i<matches.length;i++){
        matches[i].addEventListener("click",function(event){ //listens for clicks
            var search = event.target.innerHTML
            Wtext = event.target.nextElementSibling
            if(Wtext.innerHTML=="Additional Team info from wikipedia"){
            Wfetch(search)
            } else {
                Wtext.innerHTML="Additional Team info from wikipedia"
            }
        })
    }

