# Neighborhood Map Project

This repository is for the Udacity Neighborhood Map Project. This code is hosted as a live web page at http://raphreyes.github.io/

To inspect this code simply git clone its repository: https://github.com/raphreyes/raphreyes.github.io

## How the map page works
- The page should load and display a map, and a list of amusement parks.
- On screens smaller than 960px wide, the interface displays a menu button near the filter field to toggle the list display.
- You can click a map marker, or click a list item to see information from wikipedia about that park. For example try entering 'orlando' , or 'Lake'.
- If you enter a string in the filter field, the page will show a list of parks that contain the filter text anywhere in the park name or park location. It will also filter the map markers according to the same results.
- By default the filter should frame all the markers that are filtered. On smaller screens, an icon also appears next to the filter button which will help frame all markers on the map in case you have panned the map or clicked a marker.

## Google Maps API
Without an API key, warning messages from Google may appear in your browser's console, but the page will be fully functional. Optionally you can use your own key to remove the warning messages.

## Wikipedia API
The wikipedia API will return a result based on the park name. The infowindow in the map will show a link to the wikipedia page and a snippet from the page.
The page will present a timeout message if there is no api data within 5 seconds.
