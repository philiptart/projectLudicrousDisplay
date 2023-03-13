const API_key = "fafe8cbedaafdf72bc1803ea320e36f7";
const leagueId = 39;
const currentYear = 2022;
const teamsEndpoint = `https://v3.football.api-sports.io/teams?league=${leagueId}&season=${currentYear}`;
const searchButton = $("#searchButton");
const searchBar = $("#SearchBar input");
const matchesSection = $("#Matches");

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
  for (const fixture of fixtures) {
    const team1 = fixture.teams.home.name;
    const team2 = fixture.teams.away.name;
    const team1Score = fixture.goals.home;
    const team2Score = fixture.goals.away;
    const status = fixture.fixture.status.short === "FT" ? `${team1Score} - ${team2Score}` : fixture.fixture.status.short === "NS" ? fixture.fixture.date.substring(0, 16).replace("T", " ") : fixture.fixture.status.long;
    const matchContainer = $("<div>").addClass("Match");
    const team1Card = $("<div>").addClass("Team1").append($("<h2>").text(team1));
    const versesCard = $("<div>").addClass("Verses").append($("<h2>").text("V"), $("<p>").attr("id", "match-time").text(status));
    const team2Card = $("<div>").addClass("Team2").append($("<h2>").text(team2));
    matchContainer.append(team1Card, versesCard, team2Card);


    matchesSection.append(matchContainer);

    // Click event to select one match and display statistics
    matchContainer.click(async (event) => {
      $(".Match").not($(event.currentTarget)).hide();

      const fixtureId = fixture.fixture.id;
      const statisticsEndpoint = `https://v3.football.api-sports.io/fixtures/statistics?fixture=${fixtureId}`;
      const statisticsResponse = await fetch(statisticsEndpoint, requestOptions);
      const statisticsData = await statisticsResponse.json();
      console.log(statisticsData);

      const team1Stats = statisticsData.response[0].statistics;
      const team2Stats = statisticsData.response[1].statistics;

      const statNameContainer = $("<div>").addClass("stat-name");
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

      const teamContainer = $("<div>").addClass("team-container").append(team1Container, statNameContainer, team2Container);
      const statisticsContainer = $("<div>").addClass("statistics-container").text("Statistics");
      $(event.currentTarget).after(statisticsContainer, teamContainer);
    });
  }
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
