
$('#home').on('pageinit', function(){
	//code needed for home page goes here
});
		
// $('#addItem').on('pageinit', function(){

// 		var myForm = $('#formId');
// 			myForm.validate({
// 			invalidHandler: function(form, validator) {
// 			},
// 			submitHandler: function() {
// 		var data = myForm.serializeArray();
// 			storeData(data);
// 		}
// 	});
	
// 	//any other code needed for addItem page goes here
	
// });

$(document).on( "pagebeforechange", function( e, data ) {
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
		};
	};
});

//The functions below can go inside or outside the pageinit function for the page in which it is needed.
function showCategory( urlObj, options ) {
	var categoryName = urlObj.hash.replace( /.*category=/, "" );
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
				};
				markup += "</div>"
			};
		};
		markup +="</div></ul>";
		// Find the h1 element in our header and inject the name of the category into it.
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
			};
			markup += "</div>"
		};
		markup +="</div></ul>";
		// Find the h1 element in our header and inject the name of the category into it.
		$header.find( "h1" ).html( "Display All");
	};
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
};

var autofillData = function (){
	 
};

var getData = function(){

};

var storeData = function(data){
	
};

var	deleteItem = function (){
			
};
					
var clearLocal = function(){

};


