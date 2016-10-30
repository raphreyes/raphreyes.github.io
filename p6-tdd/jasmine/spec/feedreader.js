/* feedreader.js
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against the feed reader application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */

$(function() {

    describe('RSS Feeds', function() {
        /* This is our first test - it tests to make sure that the
         * allFeeds variable has been defined and that it is not 
         * empty.
         */

        it('are defined', function() {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });

        /* This test loops through each feed in the allFeeds object 
         * and ensures it has a URL defined and that the URL is not empty.
         */

        it('have urls, and url is not empty', function() {
            var numFeeds = allFeeds.length;

            for(var f = 0; f < numFeeds; f++) {
                expect(allFeeds[f].url).toBeDefined();
                expect(allFeeds[f].url).not.toBe('');
            }
        });

        /* This Test loops through each feed in the allFeeds object
         * and ensures it has a name defined and that the name is not empty.
         */

        it('have a name, and are not empty', function() {
            var numFeeds = allFeeds.length;

            for(var f = 0; f < numFeeds; f++) {
                expect(allFeeds[f].name).toBeDefined();
                expect(allFeeds[f].name).not.toBe('');
            }
        });

    });

    /*"The menu" test suite */
    describe('The menu', function() {

        /* Write a test that ensures the menu element is
         * hidden by default.
         */

        it('is hidden by default, and has class menu-hidden', function() {
            var checkMenu = $('body').hasClass('menu-hidden');

            // check the .menu-hidden class exists
            expect(checkMenu).toBeTruthy();

            // get transform value of slide-menu when hidden
            var slideVal = $('.slide-menu').css('transform');

            // check that slide-menu has correct 'hidden' transform values
            if ($('body').hasClass('menu-hidden')) {
                expect(slideVal).toBe('matrix(1, 0, 0, 1, -192, 0)');
                }
        });

         /* Test that the menu changes
          * visibility when the menu icon is clicked. This test
          * has two expectations: does the menu display when
          * clicked and does it hide when clicked again.
          */

        it('appears when hidden and icon is clicked', function() {

            // Set menu as hidden and test - log what class is assigned before click-event to the console.
            var classIs = document.getElementsByTagName('body')[0].getAttribute('class');
            console.log('body tag contains class: ' + classIs);
            $('body').attr('class','menu-hidden');
            $('.menu-icon-link')[0].click();

            // Check if the click event removed the 'menu-hidden' class to show the menu
            var clickShow = $('body').hasClass('menu-hidden');
            expect(clickShow).toBeFalsy();
        });

        it('hides when visible and icon is clicked', function() {

            // Set menu as being shown by clearing 'menu-hidden' class from body
            $('body').attr('class','');
            $('.menu-icon-link')[0].click();

            // Check if the click event added the 'menu-hidden' class to hide the menu
            var clickHide = $('body').hasClass('menu-hidden');
            expect(clickHide).toBeTruthy();
        });

    });

    /* "Initial Entries" test suite */
    describe('Initial Entries', function() {
        /* Test that when the loadFeed function is called and completes its work, there is at least
         * a single .entry element within the .feed container.
         */

        beforeEach(function(done) {
            loadFeed(0, done);
        });

        it('contain at least one entry', function() {
            var hasEntries = $('.feed .entry').length;
            console.log('Number of feed entries is: ', hasEntries);
            expect(hasEntries).toBeGreaterThan(0);
        });
    });

    /* "New Feed Selection" test suite */
    describe('New Feed Selection', function() {
        // Test when a new feed is loaded by the loadFeed function that the content actually changes.

        // Setup array to compare feed entries
        var feedContent = [];

        beforeEach(function(done) {
            // Load two of the feeds and push the result of first entry in each feed into array
            // The first entry of the feed is pushed to the feedConetent arrey.
            loadFeed(1, function(){
                var feedOne = $('.entry').html();
                feedContent.push(feedOne);
                console.log('Confirm push feed 1: ' + feedContent[0]);
                
                // load the 2nd feed
                loadFeed(2, function(){
                        var feedTwo = $('.entry').html();
                        feedContent.push(feedTwo);
                        console.log('Confirm push feed 2: ' + feedContent[1]);
                        
                        // mark done
                        done();
                    });
            });
        });

        it('content changes when feed is loaded', function() {
            // Compare entries in array and check entry 0 does not match entry 1
            expect(feedContent[0]).toBeDefined();
            expect(feedContent[1]).toBeDefined();

            var firstFeed = feedContent[0];
            var secondFeed = feedContent[1];

            expect(firstFeed).not.toBe('');
            expect(secondFeed).not.toBe('');

            expect(firstFeed).not.toBe(secondFeed);
            console.log('Compared ' + firstFeed + ' to ' + secondFeed);
        });
    });
}());
