var state = localStorage.getItem('state'),
	keyword = window.sessionStorage.getItem('keyword'),
	fakeClick = window.sessionStorage.getItem('fakeClick'),
	chronology,
	x,
	y,
	id,
	opened = [],
	serverPath = "http://localhost:8080/TIW-AuctionProjectJS",
	buyButton = document.getElementById("buy"),
	sellButton = document.getElementById("sell"),
	logoutButton = document.getElementById("logout"),
	mainTitle = document.getElementById("mainTitle"),
  	secondaryTitle1 = document.getElementById("secondaryTitle1"),
  	secondaryTitle2 = document.getElementById("secondaryTitle2"),
  	openAuctionsList = document.getElementById("open"),
  	wonAuctionsList = document.getElementById("won"),
  	formHtml = document.getElementById("id_form"),
  	researchTitle = document.getElementById("researchTitle"),
  	researchForm = document.getElementById("researchForm"),
  	chronologyTitle = document.getElementById("chronologyTitle"),
  	chronologyList = document.getElementById("chronology");

window.addEventListener("load", loadPage, false);
logoutButton.addEventListener("click", logout, false);
buyButton.addEventListener("click", pressedBuy, false);
sellButton.addEventListener("click", pressedSell, false);

function loadPage() {
	if(localStorage.getItem("chronology") === undefined || localStorage.getItem("chronology") === null)
		chronology = [];
	else
		 chronology = JSON.parse(localStorage["chronology"]);
		//chronology = localStorage.getItem("chronology");
	if(state === "sell")
		loadSellPage();
	else if (state === undefined || state === null || state === "buy")
		loadBuyPage();
}

function loadBuyPage() {
	if(keyword === null || keyword === undefined){
		keyword = "";
	}
	window.sessionStorage.setItem('fakeClick', 'false');
	state = "buy";
	mainTitle.textContent = "Buy auction page";
	chronologyTitle.textContent = "Chronology";
	secondaryTitle1.textContent = "Open auctions";
	secondaryTitle2.textContent = "Won auctions";
  	x = new XMLHttpRequest();
 	x.onreadystatechange = updateBuyPage;
	x.open("POST", serverPath + "/GetAuctionByKeyword?keyword=" + sessionStorage.getItem('keyword'));
  	x.send();
}

function chrono() {
	if(y.readyState == 4 && y.status == 200) {
		var fullList = JSON.parse(y.response),
			auctions = fullList[0],
			tHead,
			row,
			cell,
			tBody;
		
		tHead = document.createElement("thead");
		row = document.createElement("tr");
		cell = document.createElement("th");
		cell.textContent = "Auction ID";
		row.appendChild(cell);
		cell = document.createElement("th");
		cell.textContent = "Seller";
		row.appendChild(cell);
		cell = document.createElement("th");
		cell.textContent = "Item Name";
		row.appendChild(cell);
		cell = document.createElement("th");
		cell.textContent = "Best Offer";
		row.appendChild(cell);
		cell = document.createElement("th");
		cell.textContent = "Remaining Time";
		row.appendChild(cell);
		tHead.appendChild(row);
		chronologyList.appendChild(tHead);

		tBody = document.createElement("tbody");	
		for(var i=0; i<chronology.length; i++) {
			for(var j=0; j<auctions.length; j++) {
				if(chronology[i] == auctions[j].auctionId) {
					row = document.createElement("tr");
					cell = document.createElement("td");
					cell.textContent = auctions[j].auctionId;
					row.appendChild(cell);
					cell = document.createElement("td");
					cell.textContent = auctions[j].seller;
					row.appendChild(cell);
					cell = document.createElement("td");
					cell.textContent = auctions[j].itemName;
					row.appendChild(cell);
					cell = document.createElement("td");
					cell.textContent = auctions[j].bestOffer;
					row.appendChild(cell);
					cell = document.createElement("td");
					cell.textContent = auctions[j].remainingTime;
					row.appendChild(cell);
					tBody.appendChild(row);
				}
			}
		}
		chronologyList.appendChild(tBody);
		chronologyList.setAttribute("class", "list");
	}
}

function updateBuyPage() {
    if(x.readyState == 4 && x.status == 200) {
    	if(localStorage.getItem("chronology") === undefined || localStorage.getItem("chronology") === null)
			chronology = [];
		else {
			chronology = localStorage.getItem("chronology");
			chronology = JSON.parse(chronology);
		}
		var list = JSON.parse(x.response),
			openAuctions = list[0],
			wonAuctions = list[1],
			tHead,
			tBody,
			row,
			cell,
			anchor;
  		
		tHead = document.createElement("thead");
		row = document.createElement("tr");
		cell = document.createElement("th");
		cell.textContent = "Auction ID";
		row.appendChild(cell);
		cell = document.createElement("th");
		cell.textContent = "Seller";
		row.appendChild(cell);
		cell = document.createElement("th");
		cell.textContent = "Item Name";
		row.appendChild(cell);
		cell = document.createElement("th");
		cell.textContent = "Best Offer";
		row.appendChild(cell);
		cell = document.createElement("th");
		cell.textContent = "Remaining Time";
		row.appendChild(cell);
		tHead.appendChild(row);
		openAuctionsList.appendChild(tHead);
				
		tBody = document.createElement("tbody");	
		for(var i=0; i<openAuctions.length; i++) {
			if(openAuctions[i].seller !== sessionStorage.getItem('username')) {
				opened[openAuctions[i].auctionId] = false;
				row = document.createElement("tr");
				cell = document.createElement("td");
				cell.textContent = openAuctions[i].auctionId;
				row.appendChild(cell);
				cell = document.createElement("td");
				cell.textContent = openAuctions[i].seller;
				row.appendChild(cell);
				cell = document.createElement("td");
				cell.textContent = openAuctions[i].itemName;
				row.appendChild(cell);
				cell = document.createElement("td");
				cell.textContent = openAuctions[i].bestOffer;
				row.appendChild(cell);
				cell = document.createElement("td");
				cell.textContent = openAuctions[i].remainingTime;
				row.appendChild(cell);
				cell = document.createElement("td");
				anchor = document.createElement("a");
				anchor.setAttribute('auctionId', openAuctions[i].auctionId);
				anchor.addEventListener("click", (e) => {
	        	  loadAuctionDetails(e.target.getAttribute("auctionId"));
	        	}, false);
	        	anchor.appendChild(document.createTextNode("Details"));
	        	anchor.href = "#";
				cell.appendChild(anchor);
				row.appendChild(cell);
				tBody.appendChild(row);
				row = document.createElement("tr");
				cell = document.createElement("td");
				cell.setAttribute('colspan', 6);
				cell.setAttribute('id', "open" + openAuctions[i].auctionId);
				row.appendChild(cell);
				tBody.appendChild(row);
			}
		}
		openAuctionsList.appendChild(tBody);
		
		tHead = document.createElement("thead");
		row = document.createElement("tr");
		cell = document.createElement("th");
		cell.textContent = "Auction ID";
		row.appendChild(cell);
		cell = document.createElement("th");
		cell.textContent = "Seller";
		row.appendChild(cell);
		cell = document.createElement("th");
		cell.textContent = "Item Name";
		row.appendChild(cell);
		cell = document.createElement("th");
		cell.textContent = "Final Price";
		row.appendChild(cell);
		tHead.appendChild(row);
		wonAuctionsList.appendChild(tHead);
		
		tBody = document.createElement("tbody");
		for(var i=0; i<wonAuctions.length; i++) {
			row = document.createElement("tr");
			cell = document.createElement("td");
			cell.textContent = wonAuctions[i].auctionId;
			row.appendChild(cell);
			cell = document.createElement("td");
			cell.textContent = wonAuctions[i].sellerUsername;
			row.appendChild(cell);
			cell = document.createElement("td");
			cell.textContent = wonAuctions[i].itemName;
			row.appendChild(cell);
			cell = document.createElement("td");
			cell.textContent = wonAuctions[i].finalPrice;
			row.appendChild(cell);
			tBody.appendChild(row);
		}
		wonAuctionsList.appendChild(tBody);
		
		researchTitle.textContent = "Search an auction by keyword in name or description:";
		var br = document.createElement("br"); 
			
		if(!document.forms[0]){
	
			var form = document.createElement("form");
	    	form.setAttribute("method", "POST");
			form.setAttribute("id", "createForm");
			form.className = "center";
			
			var keyword = document.createElement("input");
			keyword.setAttribute("type", "text");
			keyword.setAttribute("id", "keyword");
			keyword.setAttribute("name", "keyword");
			keyword.setAttribute("required", "");
			
			var button = document.createElement("input");
			button.setAttribute("id", "button");
			button.setAttribute("type", "submit");
			button.setAttribute("value", "search");
			
			form.appendChild(keyword);
			form.appendChild(br.cloneNode());
			form.appendChild(button);
			
			researchForm.appendChild(form);
				
			document.getElementById("keyword").insertAdjacentText('beforebegin', "Keyword ");
			
			form.querySelector("input[type='submit']").addEventListener("click", (event) => {
				console.log("clicked");
				valid = true;
				var varForm = event.target.closest("form");
				console.log("stuff");
			    for (i = 0; i < varForm.elements.length; i++) {
					console.log(varForm.elements[i]);
		            if (!varForm.elements[i].checkValidity()) {
			      	    varForm.elements[i].reportValidity();
			            valid = false;
			            break;
			        }
				}
				if(valid){
					varKeyword = new String(document.getElementById("keyword").value);
					console.log(varKeyword);
					window.sessionStorage.setItem('keyword', varKeyword);
					window.sessionStorage.setItem('fakeClick', 'true');
					pressedBuy();
				}
			});
			window.sessionStorage.setItem('keyword', "");
	    }
	    y = new XMLHttpRequest();
 		y.onreadystatechange = chrono;
		y.open("GET", serverPath + "/GoToBuy");
  		y.send();
	}
}

function loadSellPage() {
	state = "sell";
	mainTitle.textContent = "Sell auction page";
	secondaryTitle1.textContent = "Open auctions";
	secondaryTitle2.textContent = "Closed auctions";
  	x = new XMLHttpRequest();
 	x.onreadystatechange = updateSellPage;
  	x.open("GET", serverPath + "/GoToSell");
  	x.send();
}

function updateSellPage() {
    if(x.readyState == 4 && x.status == 200) {
		var list = JSON.parse(x.response),
			openAuctions = list[0],
			closedAuctions = list[1],
			tHead,
			tBody,
			row,
			cell,
			anchor;
		
		tHead = document.createElement("thead");
		row = document.createElement("tr");
		cell = document.createElement("th");
		cell.textContent = "Auction ID";
		row.appendChild(cell);
		cell = document.createElement("th");
		cell.textContent = "Item Name";
		row.appendChild(cell);
		cell = document.createElement("th");
		cell.textContent = "Best Offer";
		row.appendChild(cell);
		cell = document.createElement("th");
		cell.textContent = "Remaining Time";
		row.appendChild(cell);
		tHead.appendChild(row);
		openAuctionsList.appendChild(tHead);
		
		tBody = document.createElement("tbody");
		for(var i=0; i<openAuctions.length; i++) {
			opened[openAuctions[i].auctionId] = false;
			row = document.createElement("tr");
			cell = document.createElement("td");
			cell.textContent = openAuctions[i].auctionId;
			row.appendChild(cell);
			cell = document.createElement("td");
			cell.textContent = openAuctions[i].itemName;
			row.appendChild(cell);
			cell = document.createElement("td");
			cell.textContent = openAuctions[i].bestOffer;
			row.appendChild(cell);
			cell = document.createElement("td");
			cell.textContent = openAuctions[i].remainingTime;
			row.appendChild(cell);
			cell = document.createElement("td");
			anchor = document.createElement("a");
			anchor.setAttribute('auctionId', openAuctions[i].auctionId);
			anchor.addEventListener("click", (e) => {
	          loadAuctionDetails(e.target.getAttribute("auctionId"));
	        }, false);
	        anchor.appendChild(document.createTextNode("Details"));
	        anchor.href = "#";
			cell.appendChild(anchor);
			row.appendChild(cell);
			tBody.appendChild(row);
			row = document.createElement("tr");
			cell = document.createElement("td");
			cell.setAttribute('colspan', 6);
			cell.setAttribute('id', "open" + openAuctions[i].auctionId);
			row.appendChild(cell);
			tBody.appendChild(row);
		}
		openAuctionsList.appendChild(tBody);
		
		tHead = document.createElement("thead");
		row = document.createElement("tr");
		cell = document.createElement("th");
		cell.textContent = "Auction ID";
		row.appendChild(cell);
		cell = document.createElement("th");
		cell.textContent = "Item Name";
		row.appendChild(cell);
		cell = document.createElement("th");
		cell.textContent = "Contractor";
		row.appendChild(cell);
		cell = document.createElement("th");
		cell.textContent = "Final Price";
		row.appendChild(cell);
		cell = document.createElement("th");
		cell.textContent = "Contractor Address";
		row.appendChild(cell);
		tHead.appendChild(row);
		wonAuctionsList.appendChild(tHead);
		
		tBody = document.createElement("tbody");
		for(var i=0; i<closedAuctions.length; i++) {
			row = document.createElement("tr");
			cell = document.createElement("td");
			cell.textContent = closedAuctions[i].auctionId;
			row.appendChild(cell);
			cell = document.createElement("td");
			cell.textContent = closedAuctions[i].itemName;
			row.appendChild(cell);
			cell = document.createElement("td");
			cell.textContent = closedAuctions[i].contractorUsername;
			row.appendChild(cell);
			cell = document.createElement("td");
			cell.textContent = closedAuctions[i].finalPrice;
			row.appendChild(cell);
			cell = document.createElement("td");
			cell.textContent = closedAuctions[i].contractorAddress;
			row.appendChild(cell);
			tBody.appendChild(row);
		}
		wonAuctionsList.appendChild(tBody);
		
		formTitle.textContent = "Create an Auction:";
		var br = document.createElement("br"); 
	
		var form = document.createElement("form");
    	form.setAttribute("method", "POST");
		form.setAttribute("id", "createForm");
		form.setAttribute("enctype", "multipart/form-data");
	
    	var itemName = document.createElement("input");
		itemName.setAttribute("id", "itemName");
    	itemName.setAttribute("type", "text");
    	itemName.setAttribute("name", "itemName");
		itemName.setAttribute("required", "");
		
    	var description = document.createElement("input");
		description.setAttribute("id", "description");
    	description.setAttribute("type", "text");
    	description.setAttribute("name", "description");
		description.setAttribute("required", "");
	
		var deadline = document.createElement("input");
		deadline.setAttribute("id", "deadline");
		deadline.setAttribute("type", "datetime-local");
		deadline.setAttribute("name", "deadline");
		deadline.setAttribute("required", "");
	
		var initialPrice = document.createElement("input");
		initialPrice.setAttribute("id", "initialPrice");
		initialPrice.setAttribute("type", "text");
		initialPrice.setAttribute("name", "initialPrice");
		initialPrice.setAttribute("required", "");
	
		var raise = document.createElement("input");
		raise.setAttribute("id", "raise");
		raise.setAttribute("type", "text");
		raise.setAttribute("name", "raise");
		raise.setAttribute("min", "0");
		raise.setAttribute("required", "");
	
		var image = document.createElement("input");
		image.setAttribute("id", "image");
		image.setAttribute("type", "file");
		image.setAttribute("name", "file");
	
		var button = document.createElement("input");
		button.setAttribute("id", "button");
    	button.setAttribute("type", "button");
    	button.setAttribute("value", "Create Auction");

		var errorMessage = document.createElement("p");
		errorMessage.setAttribute("id", "errorMessage");
	
		form.appendChild(itemName);
		form.appendChild(br.cloneNode()); 
		form.appendChild(description);
		form.appendChild(br.cloneNode()); 
		form.appendChild(deadline);
		form.appendChild(br.cloneNode()); 
		form.appendChild(initialPrice);
		form.appendChild(br.cloneNode()); 
		form.appendChild(raise);
		form.appendChild(br.cloneNode());
		form.appendChild(image); 
		form.appendChild(br.cloneNode()); 
		form.appendChild(button);
		form.appendChild(br.cloneNode()); 
		form.appendChild(errorMessage);
	
		formHtml.appendChild(form);
		
		document.getElementById("itemName").insertAdjacentText('beforebegin', "Item Name ");
		document.getElementById("description").insertAdjacentText('beforebegin', "Description ");
		document.getElementById("deadline").insertAdjacentText('beforebegin', "Deadline ");
		document.getElementById("initialPrice").insertAdjacentText('beforebegin', "Initial Price ");
		document.getElementById("raise").insertAdjacentText('beforebegin', "Raise ");
		document.getElementById("image").insertAdjacentText('beforebegin', "Choose an image ");
	
		form.querySelector("input[type='button']").addEventListener("click", (event) => {
			valid = true;
			var varForm = event.target.closest("form");
	    	for (i = 0; i < varForm.elements.length; i++) {
				console.log(varForm.elements[i]);
            	if (!varForm.elements[i].checkValidity()) {
	      	    	varForm.elements[i].reportValidity();
	            	valid = false;
	            	break;
	        	}
			}
			if(valid){
	        	makeCall("POST", "CreateAuction", document.getElementById("createForm"),
	        		function(req) {
	            	if (req.readyState == XMLHttpRequest.DONE) {
	              		var message = req.responseText;
	               		switch(req.status){
							case 200: 
								localStorage.setItem("state", "sell");
								pressedSell();
								break;
							default:
				            	document.getElementById("errorMessage").textContent = message;
								break;
						}
	            	}
				});
			}
			
		});
	}
}

function loadAuctionDetails(auctionId) {
	id = auctionId;
	if(opened[auctionId] === false) {
		x = new XMLHttpRequest();
 		x.onreadystatechange = updateAuctionDetails;
  		x.open("GET", serverPath + "/GetAuctionDetails?auctionid=" + auctionId);
  		x.send();
  	} else {
  		closeAuctionDetails();
  	}
}

function updateAuctionDetails() {
	if(x.readyState == 4 && x.status == 200) {
		if(state === "buy") {
			localStorage.setItem("state", "buy");
			var pre = [id];
			for(var i=0; i<chronology.length; i++) {
				if(chronology[i] === id) {
					chronology.splice(i, 1);
				}
			}
			for(var i=0; i<chronology.length; i++) {
				pre.push(chronology[i]);
			}
			chronology = pre;
			localStorage.setItem("chronology", JSON.stringify(chronology));
		}
		
		var auctionDetails = JSON.parse(x.response),
			td,
			h1,
			p,
			imgTable,
			imgTr,
			imgTd,
			img,
			bidTable,
			bidThead,
			bidTbody,
			bidTr,
			bidTh,
			bidTd;
		td = document.getElementById("open" + id);
		h1 = document.createElement("h1");
		h1.textContent = "Auction for " + auctionDetails.item.name + " by " + auctionDetails.seller;
		td.appendChild(h1);
		p = document.createElement("p");
		p.textContent = "Remaining time " + auctionDetails.remainingTime;
		td.appendChild(p);
		imgTable = document.createElement("table");
		imgTable.setAttribute('class', "center");
		imgTr = document.createElement("tr");
		for(var i=0; i<auctionDetails.item.pictures.length; i++) {
			imgTd = document.createElement("td");
			img = document.createElement("img");
			img.setAttribute('class', "fixed");
			img.src = serverPath + "/images/" + auctionDetails.item.pictures[i].pictureUrl;
			imgTr.appendChild(imgTd.appendChild(img));
		}
		imgTable.appendChild(imgTr);
		td.appendChild(imgTable);
		p = document.createElement("p");
		p.textContent = auctionDetails.item.description;
		td.appendChild(p);
		p = document.createElement("p");
		p.textContent = "Initial price: " + auctionDetails.initialPrice + " raise: " + auctionDetails.raise;
		td.appendChild(p);
		
		var aId = auctionDetails.auctionId;
							
		if(state === "buy"){					
									
			var title = document.createElement("h3");
			title.setAttribute("id", "title");
			title.textContent = "Send a bid for this auction:";
				
			td.appendChild(title);
			
			var br = document.createElement("br"); 
			var formBidHtml = document.createElement("p");
			formBidHtml.setAttribute("class", "center");
			formBidHtml.setAttribute("id", "formBidHtml");
				
			//td.appendChild(br);
			td.appendChild(formBidHtml);
			
			var form = document.createElement("form");
	    	form.setAttribute("method", "POST");
			form.setAttribute("id", "createForm" + aId);
			form.setAttribute("enctype", "multipart/form-data");
				
			var bid = document.createElement("input");
			bid.setAttribute("id", "bid");
			bid.setAttribute("type", "number");
			bid.setAttribute("step", "0.01");
			bid.setAttribute("name", "bid");
			bid.setAttribute("required", "");
				
			var auctionId = document.createElement("input");
			auctionId.setAttribute("id", "auctionId");
			auctionId.setAttribute("type", "hidden");
			auctionId.setAttribute("name", "auctionId");
			auctionId.setAttribute("value", aId);
				
			var button = document.createElement("input");
			button.setAttribute("id", "button");
			button.setAttribute("type", "submit");
			button.setAttribute("value", "Add bid");
		
			var errorMessage = document.createElement("p");
			errorMessage.setAttribute("id", "errorMessage" + aId);
		
			form.appendChild(document.createTextNode("Offer: "));
			form.appendChild(bid);
			form.appendChild(br.cloneNode());
			form.appendChild(auctionId);
			form.appendChild(br.cloneNode()); 
			form.appendChild(button);
			form.appendChild(br.cloneNode()); 
			form.appendChild(errorMessage);
		 
			formBidHtml.appendChild(form);
		
			//document.getElementById("bid").insertAdjacentText('beforebegin', "Offer ");
	
			form.querySelector("input[type='submit']").addEventListener("click", (event) => {
				valid = true;
				var varForm = event.target.closest("form");
		    	for (i = 0; i < varForm.elements.length; i++) {
					console.log(varForm.elements[i]);
		           	if (!varForm.elements[i].checkValidity()) {
			      	    varForm.elements[i].reportValidity();
			            valid = false;
		    	        break;
		        	}
				}
				if(valid){
			        makeCall("POST", "CreateBid", document.getElementById("createForm" + aId),
			        	function(req) {
		    	        if (req.readyState == XMLHttpRequest.DONE) {
		              		var message = req.responseText;
		               		switch(req.status){
								case 200: 
									autoclick(aId);
									autoclick(aId);
									break;
								default:
						            document.getElementById("errorMessage" + aId).textContent = message;
									break;
							}
		            	}	
					});
				}
		
			});
			
		}
		
		bidTable = document.createElement("table");
		bidThead = document.createElement("thead");
		bidTable.appendChild(bidThead);
		bidTbody = document.createElement("tbody");
		var maxOffer = 0;
		for(var i=0; i<auctionDetails.bidList.length; i++) {
			if(i === 0) {
				bidTable.setAttribute('class', "sublist");
				bidTh = document.createElement("th");
				bidTh.textContent = "User";
				bidThead.appendChild(bidTh);
				bidTh = document.createElement("th");
				bidTh.textContent = "Offer";
				bidThead.appendChild(bidTh);
				bidTh = document.createElement("th");
				bidTh.textContent = "Date";
				bidThead.appendChild(bidTh);
				maxOffer = auctionDetails.bidList[0].offer;
			}
			bidTr = document.createElement("tr");
			bidTd = document.createElement("td");
			bidTd.textContent = auctionDetails.bidList[i].username;
			bidTr.appendChild(bidTd);
			bidTd = document.createElement("td");
			bidTd.textContent = auctionDetails.bidList[i].offer;
			bidTr.appendChild(bidTd);
			bidTd = document.createElement("td");
			bidTd.textContent = auctionDetails.bidList[i].dateTime;
			bidTr.appendChild(bidTd);
			bidTbody.appendChild(bidTr);
		}
		if(state === "buy") {
			var offer = document.getElementById("open" + aId).parentElement.previousSibling.childNodes[3];
			offer.textContent = maxOffer;
			}
		bidTable.appendChild(bidTbody);
		td.appendChild(bidTable);
		opened[id] = true;
		if(state === "sell"){
			
			var br = document.createElement("br"); 
			var closeForm = document.createElement("p");
			closeForm.setAttribute("class", "center");
			closeForm.setAttribute("id", "closeForm");

			td.appendChild(br);
			td.appendChild(closeForm);
			
			var form = document.createElement("form");
	    	form.setAttribute("method", "POST");
			form.setAttribute("id", "closeForm" + aId);
			form.setAttribute("enctype", "multipart/form-data");
			
			var auctionId = document.createElement("input");
			auctionId.setAttribute("id", "auctionId");
			auctionId.setAttribute("type", "hidden");
			auctionId.setAttribute("name", "auctionId");
			auctionId.setAttribute("value", aId);
			
			var closeButton = document.createElement("input");
			closeButton.setAttribute("id", "closeButton");
			closeButton.setAttribute("type", "submit");
			//closeButton.setAttribute("name", "auctionId");
			closeButton.setAttribute("value", "Close");
			var errorMessageClose = document.createElement("p");
			errorMessageClose.setAttribute("id", "errorMessageClose");

			form.appendChild(auctionId);
			form.appendChild(closeButton);
			form.appendChild(errorMessageClose);
			
			closeForm.appendChild(form);
			
			form.querySelector("input[type='submit']").addEventListener("click", () =>{
				console.log(aId);
				
				x = new XMLHttpRequest();
				x.open("POST", serverPath + "/CloseAuction?auctionId=" + aId);
				x.onreadystatechange = handleClosing;
			  	x.send();
			});
		}	
    }
}
		
function handleClosing() {
	if(x.readyState == 4) {
		if(x.status == 200) {
			pressedSell();
			//loadPage();
		} else {
			document.getElementById("errorMessageClose").textContent = JSON.parse(x.response);
		}
	}
}



function autoclick(auctionId) {
	  var e = new Event("click");
	  var selector = "a[auctionid='" + auctionId + "']";
	  var anchorToClick =  document.querySelector(selector);
	  anchorToClick.dispatchEvent(e);
}

function closeAuctionDetails() {
	var cell;
	td = document.getElementById("open" + id);
	cell = document.createElement("td");
	cell.setAttribute('colspan', 6);
	cell.setAttribute('id', "open" + id);
	td.replaceWith(cell);
	opened[id] = false;
}

function logout() {
	window.location.href = "Logout";
}

function pressedBuy() {
	chronologyList.innerHTML = '';
	chronologyList.classList.remove("list");
	openAuctionsList.innerHTML = '';
  	wonAuctionsList.innerHTML = '';
  	mainTitle.innerHTML = '';
  	chronologyTitle.innerHTML = '';
  	secondaryTitle1.innerHTML = '';
  	secondaryTitle2.innerHTML = '';
  	formTitle.innerHTML = '';
  	formHtml.innerHTML = '';
  	researchForm.innerHTML = '';
  	researchTitle.innerHTML = '';
  	state = "buy";
	if(window.sessionStorage.getItem('fakeClick') === 'false'){
		window.sessionStorage.setItem('keyword', "");
		console.log(window.sessionStorage.getItem('keyword'));
	}
  	loadPage();
}

function pressedSell() {
	chronologyList.innerHTML = '';
	chronologyList.classList.remove("list");
	openAuctionsList.innerHTML = '';
  	wonAuctionsList.innerHTML = '';
  	mainTitle.innerHTML = '';
  	chronologyTitle.innerHTML = '';
  	secondaryTitle1.innerHTML = '';
  	secondaryTitle2.innerHTML = '';
  	formTitle.innerHTML = '';
  	formHtml.innerHTML = '';
  	researchForm.innerHTML = '';
  	researchTitle.innerHTML = '';
  	state = "sell";
  	loadPage();
}

function makeCall(method, url, formElement, cback, reset = true) {
	    var req = new XMLHttpRequest();
	    req.onreadystatechange = function() {
	      cback(req)
	    }; // closure
	    req.open(method, url);
	    if (formElement == null) {
	      req.send();
	    } else {
	      req.send(new FormData(formElement));
	    }
	    if (formElement !== null && reset === true) {
	      formElement.reset();
	    }
}