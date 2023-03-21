const API_key = "fafe8cbedaafdf72bc1803ea320e36f7"; //API key for API football
const leagueId = 39; //league 39 is the english premier league
const currentYear = 2022; // starting year of tournement, this could be automatically updated using some logic and dayJS
const teamsEndpoint = `https://v3.football.api-sports.io/teams?league=${leagueId}&season=${currentYear}`; //building of query including root and query parameters
const searchButton = $("#searchButton");//get the search button from the html
const searchBar = $("#SearchBar input"); // get the input form for the search
const matchesSection = $("#Matches"); // Get the section where matches are to be displayed
var item =1 // a variable used to cycle colouring in the match results for a more readable ux
var colourClass ="" // a variable to set the class of the match results, placed here to be gloablly available



  

var itemClassSelector = function(){ //function to cycle the colouring on the generated results
  if(item==1){ //first, item=1
    colourClass = "is-primary"; //is primary colour 
    item++; //increment so item =2
  } else if (item==2){ // second, item =2
    colourClass = "is-warning";//is warning colour
    item++;//increment so item =3
  } else {//when item =3
    item=1;//reset item to equal 1, restarting the cycle
    colourClass = "is-link";//using link colour
  }
}

// Set headers for API requests
const myHeaders = new Headers();
myHeaders.append("x-rapidapi-key", API_key);
myHeaders.append("x-rapidapi-host", "v3.football.api-sports.io");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};



// Function to get team ID from team name
async function getTeamId(teamName) {
  const response = await fetch(teamsEndpoint, requestOptions);
  const data = await response.json();
  const team = data.response.find(t => t.team.name.toLowerCase() === teamName.toLowerCase());
  return team.team.id;
}

// Function to get fixtures for a team
async function getFixtures(teamId) {
  const fixturesEndpoint = `https://v3.football.api-sports.io/fixtures?league=${leagueId}&season=${currentYear}&team=${teamId}`;
  const response = await fetch(fixturesEndpoint, requestOptions);
  const data = await response.json();
  return data.response;
}

// Function to display fictures
async function displayFixtures(fixtures) {
  // Clear any existing matches and add 'on' class to show section
  matchesSection.empty().addClass("on");

  fixtures.sort((a, b) => new Date(a.fixture.date) - new Date(b.fixture.date));
  //explainer heading
    const headerContainer = $("<container>").addClass("Match notification");
    const team1head = $("<card>").addClass("Team1").append($("<h1>").addClass("FontBold").text("Click for team info"));
    const verseshead = $("<card>").addClass("Verses").append($("<h1>").addClass("FontBold").text("Click for game info"));
    const team2head = $("<card>").addClass("Team2").append($("<h1>").addClass("FontBold").text("Click for team info"));
    headerContainer.append(team1head, verseshead, team2head);
    matchesSection.append(headerContainer);

// Iterate over each fixture and add to the matches section
  for (const fixture of fixtures) {
    itemClassSelector()


    // Extract data from the fixture object
    const team1 = fixture.teams.home.name;
    const team2 = fixture.teams.away.name;
    const team1Score = fixture.goals.home;
    const team2Score = fixture.goals.away;
    const status = fixture.fixture.status.short === "FT" ? `${team1Score} - ${team2Score}` : fixture.fixture.status.short === "NS" ? fixture.fixture.date.substring(0, 16).replace("T", " ") : fixture.fixture.status.long;
    // Create HTML elements for the match container
    const matchContainer = $("<container>").addClass("Match notification "+colourClass);
    const team1Card = $("<card>").addClass("Team1").append($("<h2>").addClass("FontBold").text(team1));
    const versesCard = $("<card>").addClass("Verses").append($("<h3>").addClass("FontBold").text("V"), $("<p>").attr("id", "match-time").text(status));
    const team2Card = $("<card>").addClass("Team2").append($("<h2>").addClass("FontBold").text(team2));
    team1Card.append("<p>");
    team2Card.append("<p>");
    matchContainer.append(team1Card, versesCard, team2Card);
    
  


    matchesSection.append(matchContainer);

    // Click event to select one match and display statistics
    versesCard.click(async (event) => {
      var parentEl = event.target.parentElement.parentElement  // Get parent element of clicked element
      $(parentEl).addClass("clicked"); // Add class "clicked" to the parent element
    
      const fixtureId = fixture.fixture.id;
      const statisticsEndpoint = `https://v3.football.api-sports.io/fixtures/statistics?fixture=${fixtureId}`;
      const statisticsResponse = await fetch(statisticsEndpoint, requestOptions); // Send GET request to statistics endpoint using fetch function
      const statisticsData = await statisticsResponse.json();

      // Retrieve statistics data for each team
      const team1Stats = statisticsData.response[0].statistics; 
      const team2Stats = statisticsData.response[1].statistics;
    
      // Check if the statistics container already exists
      const existingStatsContainer = $(parentEl).next(".team-container");
      if (existingStatsContainer.length > 0) {
        existingStatsContainer.remove(); // Remove the existing container
        return; // 
      }
       // If the statistics container doesn't exist, create it
      const statNameContainer = $("<div>").addClass("stat-name FontBold");
      const statNameList = $("<ul>").addClass("statNameList");
    // Add the statistic names to the list
      statNameList.append(
        $("<li>").text("possession"),
        $("<li>").text("shots on goal"),
        $("<li>").text("fouls"),
        $("<li>").text("yellow cards"),
        $("<li>").text("red cards")
      );
      statNameContainer.append(statNameList);
    
      
    // Create container for statistics of team 1
      const team1Container = $("<div>").addClass("team1-container");
      const team1StatsList = $("<ul>").addClass("statList");
      team1StatsList.append(
        $("<li>").text(team1Stats[9].value),    // Add statistics values for team 1 to list
        $("<li>").text(team1Stats[0].value),
        $("<li>").text(team1Stats[6].value),
        $("<li>").text(team1Stats[10].value),
        $("<li>").text(team1Stats[11].value),
      );
      const team1StatsDiv = $("<div>").addClass("team1-stats").append(team1StatsList);
      team1Container.append(team1StatsDiv);
    
        // Create container for statistics of team 1
      const team2Container = $("<div>").addClass("team2-container");
      const team2StatsList = $("<ul>").addClass("statList");
      team2StatsList.append(
        $("<li>").text(team2Stats[9].value),  // Add statistics values for team 1 to list
        $("<li>").text(team2Stats[0].value),
        $("<li>").text(team2Stats[6].value),
        $("<li>").text(team2Stats[10].value),
        $("<li>").text(team2Stats[11].value)
      );
      const team2StatsDiv = $("<div>").addClass("team2-stats").append(team2StatsList);
      team2Container.append(team2StatsDiv);
          // Combine the containers for both teams and the statistic names into one container
      const teamContainer = $("<div>").addClass("team-container notification").append(team1Container, statNameContainer, team2Container);
      $(parentEl).after(teamContainer);
      $(".clicked").off("click");
    });
  }eventListener();
}

// define the showModal function to display the modal
function showModal(title, message) {

  // create the modal elements
  const modal = $('<div class="modalOn"></div>');
  const modalBackground = $('<div class="modal-background"></div>');
  const modalCard = $('<div class="modal-card"></div>');
  const modalHeader = $('<header class="modal-card-head"></header>');
  const modalTitle = $('<p class="modal-card-title"></p>').text(title);
  const modalBody = $('<section class="modal-card-body"></section>').html(message);
  const modalCloseButton = $('<button class="delete" aria-label="close"></button>');
  // assemble the modal elements
  modalHeader.append(modalTitle);
  modalHeader.append(modalCloseButton);
  modalCard.append(modalHeader);
  modalCard.append(modalBody);
  modal.append(modalBackground);
  modal.append(modalCard);
  // add event listener to close the modal when the close button is clicked
  modalCloseButton.on('click', function() {

    modal.remove();
    $('html').removeClass('is-clipped');
  });
  // add the modal to the DOM

  $('html').addClass('is-clipped');
  $('body').append(modal);
}



//search trigger
var searchTrigger = async()=>{
  const teamName = searchBar.val().trim(); //gets value in the search bar
  if (teamName !== "") { //checks if search is empty
    try {
      const teamId = await getTeamId(teamName);
      const fixtures = await getFixtures(teamId);
      displayFixtures(fixtures);
    } catch (error) { //if error is returned
      
      const message = "Sorry, "+teamName+" is not a valid team. Please enter a valid team name.";
      showModal("Invalid Team", message); //display the error in the console
      console.log(error);
    }
  }
}
// click and keydown for search button
searchBar.on("keydown", async (event) => {
  if (event.which === 13) { //if the enter key is clicked
    event.preventDefault(); //dont reset
    searchTrigger() //trigger the search
  }
});

searchButton.on("click", async (event) => { //when search is clicked
  event.preventDefault(); //dont reset 
  searchTrigger();//trigger the search
  });


// Search history
$(document).ready(function() {
  //valid teams
  const currentTeams = ["arsenal", "aston villa", "brentford", "brighton", "bournemouth", "chelsea", "crystal palace", "everton", "leeds united", "leicester city", "liverpool", "manchester city", "manchester united", "newcastle", "fulham", "southampton", "tottenham", "nottingham forest", "west ham", "wolves"];
  const previousSearches = JSON.parse(localStorage.getItem("previousSearches")) || [];//get previous searches from local storage
  const maxPreviousSearches = 6; //sets the max number of prev searches 
  $("#searchButton").click(search);

  $("#SearchBox").keydown(function(event) {
    if (event.which === 13) {
      search();
    }
  });

  function search() {
    const searchTerm = $("#SearchBox").val().toLowerCase();
    if (currentTeams.includes(searchTerm)) { //checks that the search was with a valid team
      if(previousSearches.includes(searchTerm)){
      }else{previousSearches.unshift(searchTerm);} //put the new search at top of array
      if (previousSearches.length > maxPreviousSearches) {//if the previous search array is over the max lenght, remove the last one
        previousSearches.pop();
      }
      localStorage.setItem("previousSearches", JSON.stringify(previousSearches));//store the searches in local storage
    }
    updatePreviousSearchesButtons(previousSearches);
  }

  updatePreviousSearchesButtons(previousSearches);

  // console.log("Previous searches:", previousSearches);


// update search buttons with recent searches
  function updatePreviousSearchesButtons(searches) {
    $(".previous-searches-container").remove();
    const uniqueSearches = []; //Check if team is already displayed as a button in history 


    // Iterate through the searches array. Check for duplicates. Add unique searches to the uniqueSearches array
    for (var i = 0; i < searches.length; i++) {
      if (!uniqueSearches.includes(searches[i])) {
        uniqueSearches.push(searches[i]);
        if (uniqueSearches.length > 4) { // If there are more than 4 unique searches, stop adding to the array
        }
      }
    }
    for (var i = 0; i < uniqueSearches.length; i++) { // Iterate through the uniqueSearches array and create a button for each search
      const searchTerm = uniqueSearches[i];
      const button = $("<button>").addClass("button is-outlined previous-searches-button").text(searchTerm);  // Create a button element with the search term text and attach a click listener that will update the search box and trigger a new search
      button.click(function() {
        $("#SearchBox").val($(this).text());
        searchTrigger();
      });
      const container = $("<div>").addClass("previous-searches-container").append(button);  // Create a container div for the button and add it to the previous searches container element
      $("#PrevSearches").append(container);
    }
  }
});

