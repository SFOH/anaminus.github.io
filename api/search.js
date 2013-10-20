$(document).ready(function() {
	var searchInput = $("#search-input");
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

	function doSearch() {
		if (fuse == undefined) {
			return;
		}
		var text = searchInput.val();

		resultContainer.empty();

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
			}
		}
	}

	var timer;
	searchInput.on("input", function() {
		timer && clearTimeout(timer);
		timer = window.setTimeout(doSearch, 200);
	})
})
