var x,
	id,
	opened = [],
	serverPath = "http://localhost:8080/TIW-AuctionProjectJS",
  	listaOpenAuctions = document.getElementById("open");

window.addEventListener("load", loadOpenAuctions, false);
listaOpenAuctions.addEventListener("change", loadOpenAuctions, false);


function loadOpenAuctions() {
  	x = new XMLHttpRequest();
 	x.onreadystatechange = updateOpenAuctions;
  	x.open("GET", serverPath + "/GoToBuy");
  	x.send();
}

function updateOpenAuctions() {
    if(x.readyState == 4 && x.status == 200) {
		var openAuctions = JSON.parse(x.response),
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
			listaOpenAuctions.appendChild(row);
			row = document.createElement("tr");
			cell = document.createElement("td");
			cell.setAttribute('colspan', 4);
			cell.setAttribute('id', "open" + openAuctions[i].auctionId);
			row.appendChild(cell);
			listaOpenAuctions.appendChild(row);
		}
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
		for(var image in auctionDetails.item.pictures) {
			imgTd = document.createElement("td");
			img = document.createElement("img");
			img.setAttribute('class', "fixed");
			img.src = serverPath + "/images/" + image.pictureUrl;
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
	cell.setAttribute('colspan', 4);
	cell.setAttribute('id', "open" + id);
	td.replaceWith(cell);
	opened[id] = false;
}
