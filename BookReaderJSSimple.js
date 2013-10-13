





var dummyPageCount = null;








// Create the BookReader object
br = new BookReader();

// Return the width of a given page.  Here we assume all images are 800 pixels wide
br.getPageWidth = function(index) {
    return 800;
}

// Return the height of a given page.  Here we assume all images are 1200 pixels high
br.getPageHeight = function(index) {
    return 1200;
}

// We load the images from archive.org -- you can modify this function to retrieve images
// using a different URL structure
br.getPageURI = function(index, reduce, rotate) {
    // reduce and rotate are ignored in this simple implementation, but we
    // could e.g. look at reduce and load images from a different directory
    // or pass the information to an image server
    var leafStr = '000';
    var imgStr = (index+1).toString();
    var re = new RegExp("0{"+imgStr.length+"}$");
    window.pageNumberVar = leafStr.replace(re, imgStr);
    var url = 'http://api.seviye.com.tr/book-page-image-direct/30/'+ pageNumberVar + '?token=7ceca5e4842974a52641a6e5fe593f52348a1f5d-5834d8777748c5e8f785e14d7c88994c-a207b64ebb8305cbd645';
    console.log(window.pageNumberVar);
    return url;
}

// Return which side, left or right, that a given page should be displayed on
br.getPageSide = function(index) {
    if (0 == (index & 0x1)) {
        return 'R';
    } else {
        return 'L';
    }
}

// This function returns the left and right indices for the user-visible
// spread that contains the given index.  The return values may be
// null if there is no facing page or the index is invalid.
br.getSpreadIndices = function(pindex) {   
    var spreadIndices = [null, null]; 
    if ('rl' == this.pageProgression) {
        // Right to Left
        if (this.getPageSide(pindex) == 'R') {
            spreadIndices[1] = pindex;
            spreadIndices[0] = pindex + 1;
        } else {
            // Given index was LHS
            spreadIndices[0] = pindex;
            spreadIndices[1] = pindex - 1;
        }
    } else {
        // Left to right
        if (this.getPageSide(pindex) == 'L') {
            spreadIndices[0] = pindex;
            spreadIndices[1] = pindex + 1;
        } else {
            // Given index was RHS
            spreadIndices[1] = pindex;
            spreadIndices[0] = pindex - 1;
        }
    }
    
    return spreadIndices;
}

// For a given "accessible page index" return the page number in the book.
//
// For example, index 5 might correspond to "Page 1" if there is front matter such
// as a title page and table of contents.
br.getPageNum = function(index) {
    return index+1;
}

$.ajax({
    url: 'http://api.seviye.com.tr/userbook?token=7ceca5e4842974a52641a6e5fe593f52348a1f5d-5834d8777748c5e8f785e14d7c88994c-a207b64ebb8305cbd645',
    async: false,
    dataType: 'json',
    success: function (data) {
        dummyPageCount = parseInt(data['books'][0]['totalPage']);
    }
});
br.numLeafs=dummyPageCount;

console.log(window["pageNumberVar"]);
// Book title and the URL used for the book title link
br.bookTitle= 'Open Library BookReader Presentation';
br.bookUrl  = 'http://openlibrary.org';

// Override the path used to find UI images
br.imagesBaseURL = '../BookReader/images/';

br.getEmbedCode = function(frameWidth, frameHeight, viewParams) {
    return "Embed code not supported in bookreader demo.";
}

// Let's go!
br.init();


$.ajax({
    url: 'http://api.seviye.com.tr/book-item?bookID=30&token=7ceca5e4842974a52641a6e5fe593f52348a1f5d-5834d8777748c5e8f785e14d7c88994c-a207b64ebb8305cbd645',
    async: false,
    dataType: 'json',
    success: function (data) {
        console.log(data.bookItems[0]);
        for(var i in data.bookItems) {
            console.log(data.bookItems[i].page);
        }

    }
});


// read-aloud and search need backend compenents and are not supported in the demo
$('#BRtoolbar').find('.read').hide();
$('#textSrch').hide();
$('#btnSrch').hide();
