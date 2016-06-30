# Feed Reader Testing Project

This repository is for the Udacity Feed Reader Testing Project. This code is hosted as a live web page at http://raphreyes.github.io/

To inspect the code for this project simply "git clone" its repository from: https://github.com/raphreyes/raphreyes.github.io

## Jasmine
Jasmine 2.1.2 is used for this project. More information about Jasmine is here: http://jasmine.github.io/

## Testing
The following tests are run on the feed reader application:

- Test to make sure that the allFeeds variable has been defined and that it is not empty.
- Make sure each feed has a URL defined and is not empty
- Make sure each feed has a name defined and it is not empty
- Test the menu element is hidden by default
- Test the menu changes visibility when the menu icon is clicked

Using the beforeEach() and done() functions of Jasmine for asynchronous testing:
- Test the loadFeed function is called and completes its work, there is at least a single .entry element within the .feed container.
- Test when a new feed is loaded by the loadFeed function that the content actually changes.

