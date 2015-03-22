
$('#form-container').submit(function() {

    var $body = $('body');
    var $main_header = $('#main-header');
    var $wikiElem = $('#wikipedia-links');
    var $wiki_headerElem = $('#wikipedia-header')
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var nyt_key = 'xyz';

    $wikiElem.text("");
    $nytElem.text("");

    var street = $('#street').val();
    var city = $('#city').val();

    if (street == null || city == null || street == "" || city == "") {
        alert("Fill out all the required information!");
        return false;
    };

    $main_header.text('Displaying information about '+ street +', '+ city);

    var backgroundURL = 'https://maps.googleapis.com/maps/api/streetview?size=600x400&location='+ street +','+ city;
    $body.append('<img src="'+ backgroundURL + '" class="bgimg img-rounded" alt="OOPS! No Images.">');

    var nyt_URL = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + city + '&sort=newest&api-key='+nyt_key;

    $.getJSON(nyt_URL, function(data){
        var items = [];
        $nytHeaderElem.text('All the NY Times articles about '+city+' will be presented here'); 
        var articles = data.response.docs;
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class="article list-group-item-custom"> '+
                '<a href="'+ article.web_url + '">' + article.headline.main + '</a>' +
            '<p>'+ article.snippet + '</p></li>');
        };
    }).error(function(eventObj){
        $nytHeaderElem.text('Sorry! Articles could not be loaded.')
    });

    var wiki_URL = 'http://en.wikipedia.org/w/api.php?format=json&action=opensearch&search='+ city +
                    '&format=json';

    var wiki_request_timeout = setTimeout(function(){
        $wiki_headerElem.html('Sorry! Failed to get links from Wikipedia.');
    }, 7000);

    $.ajax({
        url: wiki_URL,
        dataType: 'jsonp',
        success: function(data){
            $wiki_headerElem.html('Showing Wiki pages for '+data[0]);
            var wiki_cities = data[1];
            var wiki_links = data[3];
            for (var i = 0; i < wiki_cities.length; i++) {
                $wikiElem.append('<li class="list-group-item-custom"><a href="' + wiki_links[i] + '">' + wiki_cities[i] + '</a></li>');
            };
            clearTimeout(wiki_request_timeout);
        }
    });

    return false;
});
