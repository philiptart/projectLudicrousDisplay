# projectLudicrousDisplay

![image](https://github.com/philiptart/projectLudicrousDisplay/blob/main/assets/deployed-app-screenshot.png)

# Web app using HTML/CSS/JavaScript/API's for football league results


Create a responsive web app that displays football scores and provides additional info to the user on a click/hover of a displayed football game utilising API interfaces of Wikipedia and API Football including previous search results.This was a team-based practical project to be to be presented/discussed in peer review as part of the Birmingham University Coding BootCamp.


# User Story

A user in a public house wants to be able to see information on the scores of the football league teams playing so the user can blend with other fans present in an informed manner.

Given: A football game is live at the time of use.
When: The user will load the web app and select a game.
Then: The user is provided with information about the football teams and scores.

In practice we focused more on overall season of games due to the lack of live games during development time
=======
# description
An app that enables the user to search for a football team in the premier league and see their fixtures for the current season. User is able to see statistics for each match, if it has already been played. They can also an exerpt from wikipedia for each team.

## GitLab Repository

```bash
https://github.com/philiptart/projectLudicrousDisplay
```
## Online Location

```bash
https://philiptart.github.io/projectLudicrousDisplay
```

## Key aspects

#### index.html

This file has been built to meet semantic html 5.0, logical, and SEO accessibility requirements.

The file is mostly generated dynamically using JS, the elements constructed in a more static fashion are: Header with project title, Search section with search bar and search history & footer with links to developers github profiles

#### CSS

This file has been designed to meet semantic, and logical requirements based on the index.html structure while coded with flexbox and the Bulma CSS Framework to make the application responsive.

Media queries were used to allow for a responsive design and maintain readability on smaller screens.


![image](./assets/Desktop%20Results.png)
![image](./assets/Mobile%20results.png)

A combination of JS and CSS was used to create contrasting styling used on match results to improve user experience and the start screen before the user makes a search

![image](./assets/Desktop%20Display.png)

# Football API development
The football API being used is called by used of the search bar, when the user enters the name of the team they wish to look up into the search bar and submit their search by click or by pressing enter, the search term is parsed and added to a query to the api.

The query structure uses the team name entered by the user as well as the set league and year defined in the JS, the response from this contains all the games past, present and future for the team searched for the entire season.

this data is parsed and separated into a number of dynamically generated containers, one per match, with separate cards for each team with classes added using jquery to allow for styling using Bulma and conventional css.

The central "verses" card is given an event listener to listen for clicks, upon click the parent element is inspected for its fixture identifier, this is then used to make a new fetch request for statistics, which are then generated in a new container under the match.

When first navigating to the site, user is presented with a search bar (previous searches underneath search bar if already used). User enters team name into search bar and clicks search button.

If user enters incorrect team name, a modal will display telling them to enter existing premier league team.
![image](./assets/Error%20modal.png)


The search will display a list of matches for the whole season. They can view data for past, present and future matches.
![image](./assets/Desktop%20Display.png)


User clicks "V" button to display statistics for match.
![image](./assets/Teams%20stats.png)

### Wiki API

The wiki API is being used here to collect info on a team when clicked, this is done by targeting the content within the team cards and using the content to search using the wiki api, this returns a page number, which can then be used to request an small extract from wikipedia, which is injected below the team name.

![image](./assets/Teams%20Wiki.png)

One issue with the wiki API is the use of sequential fetches meaning the response from click to content is over half a second

## Shortcomings

In the process of creating this application we have had to make certain decisions to allow for timely development of the site, these decisions have resulted in a working program but has left some code with repetition or other inefficiencies; if provided with additional time this would be something to address, however the proper function of the site took priority over optimal code cleanliness. This focus on a working product also limited the implementation of additional features, such as variable wiki extract lengths.

## Credits

This project was developed by Michael Walters, Aaron Hickman, and Philip Tart

## Disclaimer

This is the first group project with the Coding Bootcamp comments/feedback on syntax and feature implementation is appreciated to learn and develop from.

## License

Please edit and use this assignment for any purpose inc commercial under terms of [GNU General Public License (GPL) Version 3.0](https://www.gnu.org/licenses/gpl-3.0.html).