// Load the data for a specific category, based on
// the URL passed in. Generate markup for the items in the
// category, inject it into an embedded page, and then make
// that page the current active page.
function showCategory( urlObj, options ) {
	var categoryName = urlObj.hash.replace( /.*category=/, "" );
		// Get the object that represents the category we
		// are interested in. Note, that at this point we could
		// instead fire off an ajax request to fetch the data, but
		// for the purposes of this sample, it's already in memory.
		//job = json[x].jobType,

		// The pages we use to display our content are already in
		// the DOM. The id of the page we are going to write our
		// content into is specified in the hash before the '?'.
		var pageSelector = urlObj.hash.replace( /\?.*$/, "" );
	if (categoryName != "displayAll"){
			// Get the page we are going to dump our content into.
		var $page = $( pageSelector ),

			// Get the header for the page.
			$header = $page.children( ":jqmData(role=header)" ),

			// Get the content area element for the page.
			$content = $page.children( ":jqmData(role=content)" ),

			collapseSet = "<div id='jobs' data-role='collapsible-set' data-content-theme='b'>",
			markup = "";
		for(n in json){
			if ( categoryName === json[n].jobType[1] ) {
				var object = json[n];
				markup += "<div data-role='collapsible' data-inset='true'><h3>" + "#: " + json[n].jobNum[1] + "</h3><ul data-role='listview' data-inset='true'>";
				for (x in object){
					markup += "<li>" + object[x][0] + ": " +object[x][1] + "</li>";
				}
				markup += "</div>"
			}
		}
		markup +="</div></ul>";
		$header.find( "h1" ).html( categoryName);
	} else if ( categoryName === "displayAll"){
		var $page = $( pageSelector ),

			// Get the header for the page.
			$header = $page.children( ":jqmData(role=header)" ),

			// Get the content area element for the page.
			$content = $page.children( ":jqmData(role=content)" ),

			collapseSet = "<div id='jobs' data-role='collapsible-set' data-content-theme='b'>",
			markup = "";
		for(n in json){
			var object = json[n];
			markup += "<div data-role='collapsible' data-inset='true'><h3>" + "#: " + json[n].jobNum[1] + "</h3><ul data-role='listview' data-inset='true'>";
			for (x in object){
				markup += "<li>" + object[x][0] + ": " +object[x][1] + "</li>";
			}
			markup += "</div>"
		}
		markup +="</div></ul>";
		$header.find( "h1" ).html( "Display All");
	} 
		// Find the h1 element in our header and inject the name of
		// the category into it.

		// Inject the category items markup into the content element.
		$content.html( collapseSet + markup );
		// Pages are lazily enhanced. We call page() on the page
		// element to make sure it is always enhanced before we
		// attempt to enhance the listview markup we just injected.
		// Subsequent calls to page() are ignored since a page/widget
		// can only be enhanced once.
		$page.page();

		// Enhance what we just injected.
		$content.find( ":jqmData(role=collapsible-set)" ).collapsibleset();
		$content.find( ":jqmData(role=listview)" ).listview();

		// We don't want the data-url of the page we just modified
		// to be the url that shows up in the browser's location field,
		// so set the dataUrl option to the URL for the category
		// we just loaded.
		options.dataUrl = urlObj.href;

		// Now call changePage() and tell it to switch to
		// the page we just modified.
		$.mobile.changePage( $page, options );
}


// Listen for any attempts to call changePage().
$(document).bind( "pagebeforechange", function( e, data ) {
	// We only want to handle changePage() calls where the caller is
	// asking us to load a page by URL.
	if ( typeof data.toPage === "string" ) {
		// We are being asked to load a page by URL, but we only
		// want to handle URLs that request the data for a specific
		// category.
		var u = $.mobile.path.parseUrl( data.toPage ),
			re = /^#category-item/;
		if ( u.hash.search(re) !== -1 ) {
			// We're being asked to display the items for a specific category.
			// Call our internal method that builds the content for the category
			// on the fly based on our in-memory category data structure.
			showCategory( u, data.options );

			// Make sure to tell changePage() we've handled this call so it doesn't
			// have to do anything.
			e.preventDefault();
		}
	}
});

/*for(n in json){
	console.log(n);
	console.log(json[n].jobType[1]);
}*/