const API_key = "fafe8cbedaafdf72bc1803ea320e36f7";
const leagueId = 39;
const currentYear = 2022;
const teamsEndpoint = `https://v3.football.api-sports.io/teams?league=${leagueId}&season=${currentYear}`;
const searchButton = $("#searchButton");
const searchBar = $("#SearchBar input");
const matchesSection = $("#Matches");
var item =1
var colourClass =""



  

var itemClassSelector = function(){
  if(item%3==0){
    item++;
    colourClass = "is-link";
  } else if (item%2==0){
    item++;
    colourClass = "is-warning";
  } else {
    item++;
    colourClass = "is-primary";
  }
}

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
  matchesSection.empty();

  fixtures.sort((a, b) => new Date(a.fixture.date) - new Date(b.fixture.date));
  
  for (const fixture of fixtures) {
    itemClassSelector()

    const team1 = fixture.teams.home.name;
    const team2 = fixture.teams.away.name;
    const team1Score = fixture.goals.home;
    const team2Score = fixture.goals.away;
    const status = fixture.fixture.status.short === "FT" ? `${team1Score} - ${team2Score}` : fixture.fixture.status.short === "NS" ? fixture.fixture.date.substring(0, 16).replace("T", " ") : fixture.fixture.status.long;
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
      var parentEl = event.target.parentElement.parentElement
      $(parentEl).addClass("clicked");
    
      const fixtureId = fixture.fixture.id;
      const statisticsEndpoint = `https://v3.football.api-sports.io/fixtures/statistics?fixture=${fixtureId}`;
      const statisticsResponse = await fetch(statisticsEndpoint, requestOptions);
      const statisticsData = await statisticsResponse.json();
      console.log(statisticsData);
    
      const team1Stats = statisticsData.response[0].statistics;
      const team2Stats = statisticsData.response[1].statistics;
    
      // Check if the statistics container already exists
      const existingStatsContainer = $(parentEl).next(".team-container");
      if (existingStatsContainer.length > 0) {
        existingStatsContainer.remove(); // Remove the existing container
        return; // 
      }
    
      const statNameContainer = $("<div>").addClass("stat-name FontBold");
      const statNameList = $("<ul>").addClass("statNameList");
    
      statNameList.append(
        $("<li>").text("possession"),
        $("<li>").text("shots on goal"),
        $("<li>").text("fouls"),
        $("<li>").text("yellow cards"),
        $("<li>").text("red cards")
      );
      statNameContainer.append(statNameList);
    
      const team1Container = $("<div>").addClass("team1-container");
      const team1StatsList = $("<ul>").addClass("statList");
      team1StatsList.append(
        $("<li>").text(team1Stats[9].value),
        $("<li>").text(team1Stats[0].value),
        $("<li>").text(team1Stats[6].value),
        $("<li>").text(team1Stats[10].value),
        $("<li>").text(team1Stats[11].value),
      );
      const team1StatsDiv = $("<div>").addClass("team1-stats").append(team1StatsList);
      team1Container.append(team1StatsDiv);
    
      const team2Container = $("<div>").addClass("team2-container");
      const team2StatsList = $("<ul>").addClass("statList");
      team2StatsList.append(
        $("<li>").text(team2Stats[9].value),
        $("<li>").text(team2Stats[0].value),
        $("<li>").text(team2Stats[6].value),
        $("<li>").text(team2Stats[10].value),
        $("<li>").text(team2Stats[11].value)
      );
      const team2StatsDiv = $("<div>").addClass("team2-stats").append(team2StatsList);
      team2Container.append(team2StatsDiv);
      const teamContainer = $("<div>").addClass("team-container notification").append(team1Container, statNameContainer, team2Container);
      $(parentEl).after(teamContainer);
      $(".clicked").off("click");
    });
  }eventListener();
}

// click and keydown for search button
searchBar.on("keydown", async (event) => {
  if (event.which === 13) { 
    event.preventDefault();
    const teamName = searchBar.val().trim();
    if (teamName !== "") {
      try {
        const teamId = await getTeamId(teamName);
        const fixtures = await getFixtures(teamId);
        displayFixtures(fixtures);
      } catch (error) {
        console.log(error);
      }
    }
  }
});

searchButton.on("click", async (event) => {
  event.preventDefault(); 
  const teamName = searchBar.val().trim();
  if (teamName !== "") {
    try {
      const teamId = await getTeamId(teamName);
      const fixtures = await getFixtures(teamId);
      displayFixtures(fixtures);
    } catch (error) {
      console.log(error);
    }
  }


});


// Search history
$(document).ready(function() {

  const currentTeams = ["arsenal", "aston villa", "brentford", "brighton", "bournemouth", "chelsea", "crystal palace", "everton", "leeds united", "leicester city", "liverpool", "manchester city", "manchester united", "newcastle", "fulham", "southampton", "tottenham", "nottingham forest", "west ham", "wolves"];

  const previousSearches = JSON.parse(localStorage.getItem("previousSearches")) || [];

  const maxPreviousSearches = 6;

  $("#searchButton").click(search);

  $("#SearchBox").keydown(function(event) {
    if (event.which === 13) {
      search();
    }
  });

  function search() {
    const searchTerm = $("#SearchBox").val().toLowerCase();
    if (currentTeams.includes(searchTerm)) {
      previousSearches.unshift(searchTerm);
      if (previousSearches.length > maxPreviousSearches) {
        previousSearches.pop();
      }
      localStorage.setItem("previousSearches", JSON.stringify(previousSearches));
    }
    updatePreviousSearchesButtons(previousSearches);
  }

  updatePreviousSearchesButtons(previousSearches);

  console.log("Previous searches:", previousSearches);

  function updatePreviousSearchesButtons(searches) {
    $(".previous-searches-container").remove();
    const uniqueSearches = [];
    for (var i = 0; i < searches.length; i++) {
      if (!uniqueSearches.includes(searches[i])) {
        uniqueSearches.push(searches[i]);
        if (uniqueSearches.length > 4) {
          break;
        }
      }
    }
    for (var i = 0; i < uniqueSearches.length; i++) {
      const searchTerm = uniqueSearches[i];
      const button = $("<button>").addClass("button is-outlined previous-searches-button").text(searchTerm);
      button.click(function() {
        $("#SearchBox").val($(this).text());
      });
      const container = $("<div>").addClass("previous-searches-container").append(button);
      $("#PrevSearches").append(container);
    }
  }
});

