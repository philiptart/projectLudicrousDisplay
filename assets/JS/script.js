const API_key = "fafe8cbedaafdf72bc1803ea320e36f7";
const leagueId = 39;
const currentYear = 2022;
const teamsEndpoint = `https://v3.football.api-sports.io/teams?league=${leagueId}&season=${currentYear}`;
const searchButton = $("#searchButton");
const searchBar = $("#SearchBar input");
const matchesSection = $("#Matches");
const oneMatch = $(".match");

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

async function displayFixtures(fixtures) {
  matchesSection.empty(); 
  fixtures.forEach(async (fixture) => {
    const team1 = fixture.teams.home.name;
    const team2 = fixture.teams.away.name;
    const team1Score = fixture.goals.home; 
    const team2Score = fixture.goals.away; 
    const status = fixture.fixture.status.short === "FT"? `${team1Score} - ${team2Score}`: fixture.fixture.status.short === "NS"? fixture.fixture.date.substring(0, 16).replace("T", " "): fixture.fixture.status.long;
    const matchContainer = $("<div>").addClass("Match");
    const team1Card = $("<div>").addClass("Team1").append($("<h2>").text(team1));
    const versesCard = $("<div>").addClass("Verses").append($("<h2>").text("V"), $("<p>").attr("id", "match-time").text(status)); 
    const team2Card = $("<div>").addClass("Team2").append($("<h2>").text(team2));
    matchContainer.append(team1Card, versesCard, team2Card);
    

    matchesSection.append(matchContainer);

    // Click event to select one match and display statistics
    matchContainer.click(async (event) => {
      $(".Match").not($(event.currentTarget)).hide();

      const fixtureId = fixture.fixture.id; // Get the fixture ID of the selected match
      const statisticsEndpoint = `https://v3.football.api-sports.io/fixtures/statistics?fixture=${fixtureId}`;
      const statisticsResponse = await fetch(statisticsEndpoint, requestOptions);
      const statisticsData = await statisticsResponse.json();
      console.log(statisticsData); // Print the statistics data to the console

      const team1Container = $("<div>").addClass("team1-container").append($("<h3>").text(team1));
      const stats = $("<div>").addClass("statName").append($("<ul class='statList'>").append(
        $("<li>").text("Posession %"),
        $("<li>").text("Shots on goal"),
        $("<li>").text("Fouls"),
        $("<li>").text("Yellow cards"),
        $("<li>").text("Red cards"),
      ));
      const team2Container = $("<div>").addClass("team2-container").append($("<h3>").text(team2));
      const teamContainer = $("<div>").addClass("team-container").append(team1Container, stats, team2Container);
      const statisticsContainer = $("<div>").addClass("statistics-container").text("Statistics");

      $(event.currentTarget).after(statisticsContainer,teamContainer);
    });
  });
}
  

// Click event for search button
searchButton.on("click", async () => {
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
