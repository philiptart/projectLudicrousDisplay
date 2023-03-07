const API_key = "5605e2e711fcfe06959e84c655199e52";
const leagueId = 39; // Premier League ID
const currentYear = 2022;
const teamsEndpoint = `https://v3.football.api-sports.io/teams?league=${leagueId}&season=${currentYear}`;
const url = `https://v3.football.api-sports.io/fixtures?league=${leagueId}&season=${currentYear}`;
const searchButton = $("#searchButton");
const searchBar = $("#SearchBar input");
const matchesSection = $("#Matches");

var myHeaders = new Headers();
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

// Function to display fixtures
function displayFixtures(fixtures) {
  matchesSection.empty(); 
  fixtures.forEach(fixture => {
    const matchTime = fixture.fixture.status.short === "NS" ? fixture.fixture.date : fixture.fixture.status.long;
    const team1 = fixture.teams.home.name;
    const team2 = fixture.teams.away.name;
    const matchContainer = $("<div>").addClass("Match");
    const team1Card = $("<div>").addClass("Team1").append($("<h2>").text(team1));
    const versesCard = $("<div>").addClass("Verses").append($("<h2>").text("V"), $("<p>").attr("id", "match-time").text(matchTime));
    const team2Card = $("<div>").addClass("Team2").append($("<h2>").text(team2));
    matchContainer.append(team1Card, versesCard, team2Card);
    matchesSection.append(matchContainer);
  });
}

// Event listener for search button
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






        // fetch(url, requestOptions)
//   .then(res => res.json())
//   .then(data => {
//     const teams = new Set(data.response.map(match => match.teams.home.name.toLowerCase()).concat(data.response.map(match => match.teams.away.name.toLowerCase())));
//     console.log([teams]);
        
// //     $(document).ready(function() {   
// //       $('#searchButton').click(function() {
// //         const teamName = $('#searchBar input').val()
// //         if (teams.has(teamName)) {
// //           alert(`${teamName} is a Premier League team!`);
// //         } else {
// //           alert(`${teamName} is not a Premier League team!`);
// //         }
// //       });
// //     });
// //   })
// //   .catch(error => console.log('Error:', error));