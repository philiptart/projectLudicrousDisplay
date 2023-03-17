# projectLudicrousDisplay

![image](https://github.com/philiptart/projectLudicrousDisplay/blob/main/assets/deployed-app-screenshot.png)

# Web app using HTML/CSS/JavaScript/API's for football league results

Create a responsive web app that displays football scores and provides additional info to the user on a click/hover of a displayed football game utlising API interfaces of Wikipedia and API Football including previous search results.This was a team-based practial project to be to be presented/discussed in peer review as part of the Birmingham University Coding BootCamp.

# User Story

A user in a public house wants to be able to see information on the scores of the football league teams playing so the user can blend with other fans present in an informed manner.

Given: A football game is live at the time of use.
When: The user will load the web app and select a game.
Then: The user is provided with information about the football teams and scores.


In practice we focused more on overal season of games due to the lack of live games during development time
=======
# description 
An app that enables the user to search for a football team in the premier league and see their fixtures ofr the current season. User is able to see statistics for each match, if it has already been played. They can also an exerpt from wikipedia for each team.

# usage 
When first navigating to the site, user is presented with a search bar (previous searches underneath search bar if already used). User enters team name into search bar and clicks search button.
>>> image here 

If user enters incorrect team name, a modal will display telling them to enter existing premier league team. (IF THIS ISN'T WORKING THEN TAKE OUT)
>>> image here

The search will display a list of matches for the whole season. They can view data for past, present and future matches. 
>>> image here 

User clicks "V" button to display statistics for match, and clicks team name to display wikipedia exerpt.
>>> image here


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

Media queries were used to allow for a responsive design and maintain readiblity on smaller screens.

<!-- Add photo of mobile vs desktop layout -->

A combination of JS and CSS was used to create contrasting styling used on match results to improve user experience and the start screen before the user makes a search

<!-- add photo of start and searched state -->

### Wiki API

The wiki API is being used here to collect info on a team when clicked, this is done by targetting the content within the team cards and using the content to search using the wiki api, this returns a page number, which can then be used to request an small extract from wikipedia, which is injected below the team name.

One issue with the wiki API is the use of sequenial fetches meaning the response from click to content is over half a second


<!-- add photo of deployed state -->

Future developments ideas: variable extract length using user controls, photos from wikipedia as well as text, cached results to improve performance


## Credits

This project was developed by Michael Walters, Aaron Hickman, and Philip Tart

## Disclaimer

This is the first group project with the Coding Bootcamp comments/feedback on syntax and feature implementation is appreciated to learn and develop from.

## License

Please edit and use this assignment for any purpose inc commercial under terms of [GNU General Public License (GPL) Version 3.0](https://www.gnu.org/licenses/gpl-3.0.html).
