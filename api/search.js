$(document).ready(function() {
	$('#ref-box h1').append('<span id="search-form"><label>Search: </label></span>')
	var searchInput = $('<input id="search-input" type="text" placeholder="Class or Member"></input>').appendTo('#search-form > label');
	var boxContent = $("#box-content");

	var fuse;
	$.getJSON('/api/search-db.json', function(data) {
		fuse = new Fuse(data, {
			keys: ['search'],
			threshold: 0.3
		})
	})

	var searchResults = $('<div id="search-results"></div>').appendTo('#ref-box');
	var resultContainer = $('<ul></ul>').appendTo(searchResults);

	var firstResult;

	function doSearch() {
		if (fuse == undefined) {
			return;
		}
		var text = searchInput.val();

		resultContainer.empty();
		firstResult = null;

		if (text.length == 0) {
			searchResults.css('display', 'none')
			boxContent.css('display', 'block')
		} else {
			searchResults.css('display', 'block')
			boxContent.css('display', 'none')

			var results = fuse.search(text);
			var max = results.length > 50 ? 50 : results.length;
			for (i = 0; i < max; i++) {
				resultContainer.append('<li><a href="' + results[i].url + '">' + results[i].name + '</a></li>');
				if (i == 0) {
					firstResult = results[i].url;
				}
			}
		}
	}

	var timer;
	searchInput.on("input", function() {
		timer && clearTimeout(timer);
		timer = window.setTimeout(doSearch, 200);
	})
	searchInput.keydown(function(event) {
		if (event.which == 13 && firstResult) {
			window.location.href = firstResult;
		}
	})
})
