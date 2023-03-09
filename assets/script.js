var Wroot = "https://en.wikipedia.org/w/api.php"
var Wquery= "?action=query&format=json&prop=extracts&list=search&formatversion=2&srsearch="
var Wsearchterm ="meaning of life"
var Wformat ="&srnamespace=0&srlimit=1&srprop=snippet"
// "&format=json"
var Wsearch = ""

var WikiQuery = function(Wsearchterm){
    var Wsearcharray = Wsearchterm.split(" ") //removes the spaces from the search
    Wsearch = Wsearcharray.join("%20") //puts in the characters to represent a space "%20"
    return Wsearch;
}

var Wfetch = function(){
    WikiQuery(Wsearchterm)
    var WrequestURL= Wroot+Wquery+Wsearch+Wformat
    console.log(WrequestURL)
    fetch(WrequestURL,{mode: "no-cors"})
        .then(function(response){
            console.log(response)
            return response;
        
        })
        .then(function(data){
            // console.log(data)
            console.log(data)
        }
        )

}

Wfetch()


