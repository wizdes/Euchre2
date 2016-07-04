module Namespace.State {
    export class Instructions extends Phaser.State {

columns = 3;
    // rows of thumbnails in each page
    rows = 4;
    // thumbnail width, in pixels
    thumbWidth = 60;
    // thumbnail height, in pizels
    thumbHeight = 60;
    // empty space between two thumbnails, in pixels
    spacing = 20;
    pageText;

    colors = ["0xffffff", "0xff0000", "0x00ff00", "0x0000ff", "0xffff00"];
    instructionsText = ["Welcome to Euchre! Euchre is a game between 4 people. You, and the person across from you, are partners to win as many points as possible. The objective of the game is to get to 10 points.\n\nThere are several phases to this game: The Trump Calling round and the game round.",
        "The Trump Calling round starts at the beginning of the game. The Trump Calling round is the round where the trump suit is chosen. We'll go into what it means to have the trump suit later. \n\n The Trump Calling round has two parts: the card pickup phase and the suit picking phase. \n\nA player at the beginning of each round is chosen to start. In the card pick up round, a single card is revealed. Each player as the choice to make the starting player to pick up the card. If this is chosen, then the suit of that card is the trump suit and the game starts. Otherwise, the Trump calling round goes into the suit picking phase.",
        "The suit picking phase is where each player gets to name a suit ",
        "4",
        "5"];

    preload() {
        // level pages at the bottom
        this.game.load.image("levelpages", "assets/levelpages.png");
        // transparent background used to scroll
        this.game.load.image("transp", "assets/transp.png");
    }

    scrollingMap;

        create() {
            // setting game background color
            // just a text placed on the top of the stage to show level page
            // the tiled transparent sprite, covering the entire scrollable area which width is (number of pages) * (game width)
            this.scrollingMap = this.game.add.tileSprite(0, 0, this.colors.length * this.game.width, this.game.height, "transp");
            // this is how we tell Phaser the sprite can receive inputs
            this.scrollingMap.inputEnabled = true;
            // the sprite can be dragged
            this.scrollingMap.input.enableDrag(false);
            // the sprite can't be dragged vertically
            this.scrollingMap.input.allowVerticalDrag = false;
            // this is the bounding box which defines dragging limits
            this.scrollingMap.input.boundsRect = new Phaser.Rectangle(this.game.width - this.scrollingMap.width, this.game.height - this.scrollingMap.height, this.scrollingMap.width * 2 - this.game.width, this.scrollingMap.height * 2 - this.game.height);
            // we start at page zero, that is the first page
            this.currentPage = 0;
            // this will be the array of page thumbnails
            this.pageSelectors = [];
            // determining row length according to thumbnail width, spacing and number of columns
            var rowLength = this.thumbWidth * this.columns + this.spacing * (this.columns - 1);
            // left margin is set to every row is centered in the stage
            var leftMargin = (this.game.width - rowLength) / 2;
            // same concept applies to column height and top margin
            var colHeight = this.thumbHeight * this.rows + this.spacing * (this.rows - 1);
            var topMargin = (this.game.height - colHeight) / 2;
            // looping through all pages
            for (var k = 0; k < this.colors.length; k++) {
                // looping through all columns
                var style = { font: '50px dimboregular', fill: 'black', align: 'left', wordWrap: true, wordWrapWidth: 800 };

                var text = this.game.add.text(k * this.game.width + 400, 150, this.instructionsText[k], style);
                text.anchor.set(0.5);

                this.scrollingMap.addChild(text);

                // now it's time to place page thumbnail selectors, in a way they are centered on the stage
                this.pageSelectors[k] = this.game.add.button(this.game.width / 2 + (k - Math.floor(this.colors.length / 2) + 0.5 * (1 - this.colors.length % 2)) * 40, this.game.height - 40, "levelpages", function (e) {
                    // each page thumbnail once clicked will scroll the map by "difference" pages
                    var difference = e.pageIndex - this.currentPage;
                    // changePage will handle scrolling
                    this.changePage(difference);
                }, this);
                // each page selector is anchored on its center point
                this.pageSelectors[k].anchor.set(0.5);
                // each page selector has a page index according to the page it refers to
                this.pageSelectors[k].pageIndex = k;
                // adding a tint color so we can see we will move to "red" levels if we click or "red" page, to "green" levels if we click on "green" page and so on
                this.pageSelectors[k].tint = this.colors[k];
                // this is just to highlight current page, making it bigger (actually we are making other pages smaller)
                if (k == this.currentPage) {
                    this.pageSelectors[k].height = 30;
                }
                else {
                    this.pageSelectors[k].height = 15;
                }
            }
            // when we start dragging, we just save horizontal map position
            this.scrollingMap.events.onDragStart.add(function (sprite, pointer) {
                this.scrollingMap.startPosition = this.scrollingMap.x;
            }, this);
            // the core of the script is when we STOP dragging
            this.scrollingMap.events.onDragStop.add(function (sprite, pointer) {
                // if there wasn't any scroll, we can say it wasn't a drag so the player clicked a level
                if (this.scrollingMap.startPosition == this.scrollingMap.x) {
                    // now we just have to check for all bounding boxes to see which level thumbnail has been clicked
                    // sadly, we can't use buttons or they won't allow to detect scrolling
                    //for (var i = 0; i < this.scrollingMap.children.length; i++) {
                    //    var bounds = this.scrollingMap.children[i].getBounds();
                    //    if (bounds.contains(pointer.x, pointer.y)) {
                    //        alert("Play level " + this.scrollingMap.children[i].levelNumber);
                    //        break;
                    //    }
                    //}
                }
                else {
                    // we define 1/8 of the width of the page as the minimum amount of pixels scrolled to say the player
                    // wanted to swipe the page
                    if (this.scrollingMap.startPosition - this.scrollingMap.x > this.game.width / 8) {
                        this.changePage(1);
                    }
                    else {
                        if (this.scrollingMap.startPosition - this.scrollingMap.x < - this.game.width / 8) {
                            this.changePage(-1);
                        }
                        else {
                            this.changePage(0);
                        }
                    }
                }
            }, this);

            var backObj = this.game.add.text(800, 5, "Back", { font: '60px dimboregular', fill: '#000' });
            backObj.inputEnabled = true;
            backObj.events.onInputDown.add(event => {
                event.game.state.start('mainmenu', true);
            });
    }

        currentPage;
        pageSelectors;
        
        changePage(page) {
            // here we move the scrolling map according to selected page
            this.currentPage += page;
            for (var k = 0; k < this.colors.length; k++) {
                if (k == this.currentPage) {
                    this.pageSelectors[k].height = 30;
                }
                else {
                    this.pageSelectors[k].height = 15;
                }
            }
            var tween = this.game.add.tween(this.scrollingMap).to({
                x: this.currentPage * -this.game.width
            }, 300, Phaser.Easing.Cubic.Out, true);
        }
    }
}
