/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */

$(function() {
    /* This is our first test suite - a test suite just contains
    * a related set of tests. This suite is all about the RSS
    * feeds definitions, the allFeeds variable in our application.
    */
    

    
    describe('RSS Feeds', function() {
        /* This is our first test - it tests to make sure that the
         * allFeeds variable has been defined and that it is not
         * empty. Experiment with this before you get started on
         * the rest of this project. What happens when you change
         * allFeeds in app.js to be an empty array and refresh the
         * page?
         */
        it('are defined', function() {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });


        /* TODO: Write a test that loops through each feed
         * in the allFeeds object and ensures it has a URL defined
         * and that the URL is not empty.
         */
        it('have urls, and url is not empty', function() {
            var numFeeds = allFeeds.length;

            for(var f = 0; f < numFeeds; f++) {
                expect(allFeeds[f].url).toBeDefined();
                expect(allFeeds[f].url).not.toBe('');
            }
        });

        /* TODO: Write a test that loops through each feed
         * in the allFeeds object and ensures it has a name defined
         * and that the name is not empty.
         */
        it('have a name, and are not empty', function() {
            var numFeeds = allFeeds.length;

            for(var f = 0; f < numFeeds; f++) {
                expect(allFeeds[f].name).toBeDefined();
                expect(allFeeds[f].name).not.toBe('');
            }
        });
        
    });


    /* TODO: Write a new test suite named "The menu" */
    describe('The menu', function() {

        /* TODO: Write a test that ensures the menu element is
         * hidden by default. You'll have to analyze the HTML and
         * the CSS to determine how we're performing the
         * hiding/showing of the menu element.
         */
        
        it('is hidden by default, and has class menu-hidden', function() {
            var checkMenu = document.getElementsByTagName('body')[0].className;
            
            // get transform value of slide-menu when hidden
            var slideVal = $('.slide-menu').css('transform');
            
            // check the .menu-hidden class exists and .slide-menu exists
            expect(checkMenu).toBeDefined();
            expect(checkMenu).toBe('menu-hidden');
            expect(checkMenu).not.toBe('');
            expect('.slide-menu').toBeDefined();
            
            // check that slide-menu has 'hidden' transform values
            expect(slideVal).toBe('matrix(1, 0, 0, 1, -192, 0)')
        });
        
         /* TODO: Write a test that ensures the menu changes
          * visibility when the menu icon is clicked. This test
          * should have two expectations: does the menu display when
          * clicked and does it hide when clicked again.
          */
        
        it('appears when hidden and icon is clicked', function() {
            
            // Set menu as hidden and test
            $('body').attr('class','menu-hidden');
            $('.menu-icon-link')[0].click();
            
            // Check if the click event removed the 'menu-hidden' class to show the menu
            var clickShow = document.getElementsByTagName('body')[0].className;
            expect(clickShow).toBe('');
        });
        
        it('hides when visible and icon is clicked', function() {
            
            // Set menu as being shown by clearing 'menu-hidden' class from body
            $('body').attr('class','');
            $('.menu-icon-link')[0].click();
            
            // Check if the click event added the 'menu-hidden' class to hide the menu
            var clickHide = document.getElementsByTagName('body')[0].className;
            expect(clickHide).toBe('menu-hidden');
        });

    });
    /* TODO: Write a new test suite named "Initial Entries" */
    describe('Initial Entries', function() {
        /* TODO: Write a test that ensures when the loadFeed
         * function is called and completes its work, there is at least
         * a single .entry element within the .feed container.
         * Remember, loadFeed() is asynchronous so this test will require
         * the use of Jasmine's beforeEach and asynchronous done() function.
         */
        beforeEach(function(done) {
            loadFeed(0, function(){
                done();
            });
        });
        
        it('contain at least one entry', function(done) {
            expect($('.feed')).not.toBe('');
            expect($('.entry')).toBeDefined();
            expect($('.entry')).not.toBe('');
            done();
        });
    });
    /* TODO: Write a new test suite named "New Feed Selection"*/
    describe('New Feed Selection', function() {
        /* TODO: Write a test that ensures when a new feed is loaded
         * by the loadFeed function that the content actually changes.
         * Remember, loadFeed() is asynchronous.
         */
        
        // Setup array to compare entries
        var feedContent = [];        

        beforeEach(function(done) {
            // Load three of the feeds and push the result of first entry in each feed into array
            loadFeed(0, function(){
                feedOne = $('.entry').html();
                feedContent.push(feedOne);
                done();
            });
            
            loadFeed(1, function(){
                feedTwo = $('.entry').html();
                feedContent.push(feedTwo);
                done();
            });
            
            loadFeed(2, function(){
                feedThree = $('.entry').html();
                feedContent.push(feedThree);
                done();
            });
                
        });
        
        it('content changes when feed is loaded', function(done) {
            
            // Compare entries in array and check entry 0 does not match 1 or 2
            expect(feedContent[0]).not.toBe('');
            done();
            
            expect(feedContent[1]).not.toBe('');
            expect(feedContent[0]).not.toMatch(feedContent[1]);
            done();
            
            expect(feedContent[2]).not.toBe('');
            expect(feedContent[0]).not.toMatch(feedContent[2]);
            expect(feedContent[1]).not.toMatch(feedContent[2]);
            done();
        });
    });
}());
