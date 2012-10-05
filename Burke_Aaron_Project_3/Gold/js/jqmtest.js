
$('#home').on('pageinit', function(){
	
});
		
$('#addItem').on('pageshow', function(){
	// Enables validator debug messages. Used to test the rules: I created.
	// jQuery.validator.setDefaults({
	// 	debug: true,
	// 	success: "valid"
	// });;
	var jobNumCount;
	var myForm = $('#jobForm'),
		errorsLink = $("#errorsLink");
	var validator = myForm.validate({
		rules: {
			"select-choice-min" : {
				required: true,
			},
			custom: {
				required: function(element) {
					return ($("#select-choice-min").val() === "Custom");
				}
			}
		},
		invalidHandler: function(form, validator) {
			errorsLink.click();

			var html = "";
			for(var key in validator.submitted){
				var label = $('label[for^="'+ key +'"]').not("[generated]");
					//console.log(label.text());
				var legend = label.closest("fieldset").find(".ui-controlgroup-label");
				var fieldName = legend.length ? legend.text() : label.text();
				html += "<li>" + fieldName + "</li>";
			};
			$("#formErrors ul").html(html);
		},
		submitHandler: function(form) {
			// var data = myForm.serializeArray();
			// console.log(data);
			storeData();
			form.reset();
			jobCount();
		}
	});
	// Have reset button clear red validation messages from form created var validator
	// above to use for this
	$(".reset").click(function() {
		//validator.resetForm();
	});
	
	//any other code needed for addItem page goes here
	jobCount();
	$("#clearData").click(function() {
		clearLocal();
	});
});

// Listen for the page change events by the Browse By buttons on index.html 
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

// Function that populates the Browse By categories and localStorage
function showCategory( urlObj, options ) {
	var categoryName = urlObj.hash.replace( /.*category=/, "" ),
		pageSelector = urlObj.hash.replace( /\?.*$/, "" ),
		// Get the page we are going to dump our content into
		$page = $( pageSelector ),

		// Get the header for the page.
		$header = $page.children( ":jqmData(role=header)" ),

		// Get the content area element for the page.
		$content = $page.children( ":jqmData(role=content)" ),

		collapseSet = "<div id='jobs' data-role='collapsible-set' data-content-theme='b'>",
		markup = "";
	if (categoryName != "displayAll" && categoryName != "displayStorage"){
		// For each category selected
		for(var n in json){
			if ( categoryName === json[n].jobType[1] ) {
				var object = json[n];
				markup += "<div data-role='collapsible' data-inset='true'><h3>" + "#: " + json[n].jobNum[1] + "</h3><ul data-role='listview' data-inset='true'>";
				for (var x in object){
					markup += "<li>" + object[x][0] + ": " +object[x][1] + "</li>";
				};
				markup += "</ul></div>";
			};
		};
		markup +="</div></ul>";
		// Find the h1 element in our header and inject the name of the category into it.
		$header.find( "h1" ).html( categoryName);
	} else if ( categoryName === "displayAll"){
		for(var n in json){
			var object = json[n];
			markup += "<div data-role='collapsible' data-inset='true'><h3>" + "#: " + json[n].jobNum[1] + "</h3><ul data-role='listview' data-inset='true'>";
			for (var x in object){
				markup += "<li>" + object[x][0] + ": " +object[x][1] + "</li>";
			};
			markup += "</ul></div>";
		};
		markup +="</div></ul>";
		// Find the h1 element in our header and inject the name of the category into it.
		$header.find( "h1" ).html( "Display All");
	} else if ( categoryName === "displayStorage"){
		
		for(var n in json){
			var object = json[n];
			markup += "<div data-role='collapsible' data-inset='true'><h3>" + "#: " + json[n].jobNum[1] + "</h3><ul data-role='listview' data-inset='true'>";
			for (var x in object){
				markup += "<li>" + object[x][0] + ": " +object[x][1] + "</li>";
			};
			markup += "</ul></div>";
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
	 for(var n in json){
		var id = n;
		localStorage.setItem(id, JSON.stringify(json[n]));
	};
};

var getData = function(){
	if (localStorage.length === 1 && localStorage.getItem("jobNumber")){
		alert("Local Storage does not contain any jobs. Adding job test data.");
		autoFillData();
	};
	if(document.getElementById("items")){
		var jobListDiv = document.getElementById("items");
		jobListDiv.parentNode.removeChild(jobListDiv);
	};
	// if(searchArray[0]){
	// 	toggleControl("showSearchData");
	// } else {
	// 	toggleControl("showData");
	// };
	makeDiv = document.createElement("div");
	makeDiv.setAttribute("id", "items");
	var makeList = document.createElement("ul");
	makeDiv.appendChild(makeList);
	document.body.appendChild(makeDiv);
	ge("items").style.display = "block";
	for(var i = 0, j = localStorage.length; i < j; i++){
		// Modified section to just return search results
		if(searchArray[0] && Number(localStorage.key(i))/1 === Number(localStorage.key(i))){
			var makeLi = document.createElement("li");
			var linksLi = document.createElement("li");
			makeList.appendChild(makeLi);
			var key = localStorage.key(i);
			var value = localStorage.getItem(key);
			var object = JSON.parse(value);
			var makeSubList = document.createElement("ul");
			makeLi.appendChild(makeSubList);
			for(var n = 0, m = searchArray.length; n < m; n++){ 
				if(searchArray[n] === key){
					getImage(makeSubList, object.jobType[1]);
					for(var x in object){
						var makeSubLi = document.createElement("li");
						makeSubList.appendChild(makeSubLi);
						var objText = object[x][0]+ ": "+object[x][1];
						makeSubLi.innerHTML = objText;
					};
					makeSubList.appendChild(linksLi);
					makeItemLinks(key, linksLi);
				};
			};
		// Original getData path to display all local storage
		} else if(Number(localStorage.key(i))/1 === Number(localStorage.key(i))){
			var makeLi = document.createElement("li");
			var linksLi = document.createElement("li");
			makeList.appendChild(makeLi);
			var key = localStorage.key(i);
			var value = localStorage.getItem(key);
			var object = JSON.parse(value);
			var makeSubList = document.createElement("ul");
			makeLi.appendChild(makeSubList);
			getImage(makeSubList, object.jobType[1]);
			for(var x in object){
				var makeSubLi = document.createElement("li");
				makeSubList.appendChild(makeSubLi);
				var objText = object[x][0]+ ": "+object[x][1];
				makeSubLi.innerHTML = objText;
			};
			makeSubList.appendChild(linksLi);
			makeItemLinks(key, linksLi);
		};
	};
};

function jobCount(){
	if (localStorage.getItem("jobNumber")){
		jobNumCount = localStorage["jobNumber"];
		$("#jobnum").val(Number(jobNumCount));
	} else {
		jobNumCount = 1000;
		localStorage.setItem("jobNumber", jobNumCount.toString());
		$("#jobnum").val(jobNumCount);
	};
	//console.log(jobNumCount);
};

var storeData = function(key){
	// Random key number for each job object
	// Check to see if we are editing an existing item or it is a new item.
	if (!key || key === undefined){
		var id = jobNumCount;
		var num = Number($("#jobnum").val())+1;
		localStorage["jobNumber"] = num.toString();
	} else {
		id = key;
		
	};
	// Get Radio button status
	// getSelectedRadio();
	// Get all of the form data and create an object out of it
	var jobFormData				= {};
		jobFormData.jobNum		= ["Job Num", $("#jobnum").val()];
		jobFormData.company		= ["Company", $("#company").val()];
		jobFormData.address		= ["Address", $("#address").val()];
		jobFormData.city		= ["City", $("#city").val()];
		jobFormData.state		= ["State", $("#state").val()];
		jobFormData.zipcode		= ["Zipcode", $("#zipcode").val()];
		jobFormData.phone		= ["Phone", $("#phone").val()];
		jobFormData.email		= ["Email", $("#email").val()];
		jobFormData.oDate		= ["Order Date", $("#orderdate").val()];
		jobFormData.needDate	= ["Need Date", $("#needbydate").val()];
		jobFormData.rushOrder	= ["Rush Order", $('input:radio[name=rush]:checked').val()];
		jobFormData.jobType		= ["Job Type", $("#select.jobTypeList").val()];
		jobFormData.customInfo	= ["Custom Info", $("#custom").val()];
		jobFormData.quantity	= ["Quantity", $("#qty").val()];
		jobFormData.prodHours	= ["Production Hours", $("#production").val()];
		jobFormData.designEff	= ["Design Effort", $("#design").val()];

	localStorage.setItem(id, JSON.stringify(jobFormData));
	if (!key || key === undefined){
	alert("Job #: " + jobNumCount + " Saved");
	} else {
		alert("Job #: " + key + " Saved");
	};
	jobCount();	
};

var	deleteItem = function (){
	var ask = confirm("Are you sure you want to delete this job?");
	if(ask){
		localStorage.removeItem(this.key);
		alert("Job was deleted!");
		window.location.reload();
	} else{
		alert("Job was NOT deleted.");
	};
};

					
var clearLocal = function(){
	localStorage.clear();
	alert("All jobs deleted from local storage.");
};

