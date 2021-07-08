var state = localStorage.getItem('state'),
	x,
	id,
	opened = [],
	serverPath = "http://localhost:8080/TIW-AuctionProjectJS",
	mainTitle = document.getElementById("mainTitle"),
  	secondaryTitle1 = document.getElementById("secondaryTitle1"),
  	secondaryTitle2 = document.getElementById("secondaryTitle2"),
  	openAuctionsList = document.getElementById("open"),
  	wonAuctionsList = document.getElementById("won");

window.addEventListener("load", loadPage, false);

function loadPage() {
	console.log(state);
	if(state === "sell")
		loadSellPage();
	else if (state === undefined || state === null || state === "buy")
		loadBuyPage();
}

function loadBuyPage() {
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
			row,
			cell,
			anchor;
			
		for(var i=0; i<openAuctions.length; i++) {
		console.log(sessionStorage.getItem('username'));
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
				openAuctionsList.appendChild(row);
				row = document.createElement("tr");
				cell = document.createElement("td");
				cell.setAttribute('colspan', 6);
				cell.setAttribute('id', "open" + openAuctions[i].auctionId);
				row.appendChild(cell);
				openAuctionsList.appendChild(row);
			}
		}
		
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
			wonAuctionsList.appendChild(row);
		}
    }
}

function loadSellPage() {
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
			row,
			cell,
			anchor;
			
		for(var i=0; i<openAuctions.length; i++) {
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
			openAuctionsList.appendChild(row);
			row = document.createElement("tr");
			cell = document.createElement("td");
			cell.setAttribute('colspan', 6);
			cell.setAttribute('id', "open" + openAuctions[i].auctionId);
			row.appendChild(cell);
			openAuctionsList.appendChild(row);
		}
		
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
			wonAuctionsList.appendChild(row);
		}
		
		//Insert Create Auction Form
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