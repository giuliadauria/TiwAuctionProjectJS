var state = localStorage.getItem('state'),
	x,
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
  	researchForm = document.getElementById("id_form");

window.addEventListener("load", loadPage, false);
logoutButton.addEventListener("click", logout, false);
buyButton.addEventListener("click", pressedBuy, false);
sellButton.addEventListener("click", pressedSell, false);

function loadPage() {
	console.log(state);
	if(state === "sell")
		loadSellPage();
	else if (state === undefined || state === null || state === "buy")
		loadBuyPage();
}

function loadBuyPage() {
	state = "buy";
	mainTitle.textContent = "Buy auction page";
	secondaryTitle1.textContent = "Open auctions";
	secondaryTitle2.textContent = "Won auctions";
  	x = new XMLHttpRequest();
 	x.onreadystatechange = updateBuyPage;
  	x.open("GET", serverPath + "/GoToBuy");
  	x.send();
}

function updateBuyPage() {
    if(x.readyState == 4 && x.status == 200) {
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
		
		// bid form
		
		bidTable = document.createElement("table");
		bidThead = document.createElement("thead");
		bidTable.appendChild(bidThead);
		bidTbody = document.createElement("tbody");
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
		bidTable.appendChild(bidTbody);
		td.appendChild(bidTable);
		opened[id] = true;
    }
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
	openAuctionsList.innerHTML = '';
  	wonAuctionsList.innerHTML = '';
  	mainTitle.innerHTML = '';
  	secondaryTitle1.innerHTML = '';
  	secondaryTitle2.innerHTML = '';
  	formTitle.innerHTML = '';
  	formHtml.innerHTML = '';
  	researchForm.innerHTML = '';
  	state = "buy";
  	loadPage();
}

function pressedSell() {
	openAuctionsList.innerHTML = '';
  	wonAuctionsList.innerHTML = '';
  	mainTitle.innerHTML = '';
  	secondaryTitle1.innerHTML = '';
  	secondaryTitle2.innerHTML = '';
  	formTitle.innerHTML = '';
  	formHtml.innerHTML = '';
  	researchForm.innerHTML = '';
  	state = "sell";
  	loadPage();
}

function makeCall(method, url, formElement, cback, reset = true) {
	var req = new XMLHttpRequest(); // visible by closure
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
