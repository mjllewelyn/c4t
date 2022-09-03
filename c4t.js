var TurnEnum  = Object.freeze({"green": 1, "red": 2});
var turn = TurnEnum.green;
var spaces = "         ";
var winner = false;
var tie = false;
var turnNumber = 1;
var turnsCsv = "";
var gameCsv = "";
var endGame = false;
var today = new Date();
var date = (today.getMonth()+1)+'/'+today.getDate()+'/'+today.getFullYear()+' '+zeroPadding(today.getHours())+':'+zeroPadding(today.getMinutes())+':'+zeroPadding(today.getSeconds());

function zeroPadding(t) {
	if (t < 10)
	  return "0" + t;
	else
      return t
}

function gridButton(id) {
	var shapeid = getShape();
	if (winner)
		declareWinner();
	else if (tie)
		alert("Tie game. Refresh to restart");
	else if (checkShape(id, shapeid) && checkPiece()) {
		removeClass(id);
		assignColor(id);
		assignShape(id, shapeid);
		switchTurn();
	}
}

function shapeButton(id) {
	button = document.getElementById(id);
	if (winner)
	 	declareWinner();
	else if (tie)
		alert("Tie game. Refresh to restart");
	else if ((turn == TurnEnum.green && button.classList.contains("red")) || (turn == TurnEnum.red && button.classList.contains("green")))
		alert("Not your turn");
	else {
		pieces = getPieces(id);
		if (isAvailiable(id, pieces)) {
			removeGreenShapeClass();
			removeRedShapeClass();
			document.getElementById(id).classList.add("select");
		}
	}
}

function checkPiece() {
	var id = 0;
	var select = false;
	for (i = 1; i < 9; i++) {
		if (document.getElementById(i).classList.contains("select")) {
			select = true;
			id = i;
			break;
		}
	}
	if (select) {
		pieces = getPieces(id);
		subtractPiece(id, pieces);
		return true;
	}
	else
		alert("Please select a piece");
}

function subtractPiece(i, pieces) {
	if (i > 4)
		i -= 4;
	pieces[i-1] -= 1;
	str = (`${pieces[0]}${spaces}${pieces[1]}${spaces}${pieces[2]}${spaces}${pieces[3]}`);
	if (turn == TurnEnum.green)
		document.getElementById("greenNums").value = str;
	else 
		document.getElementById("redNums").value = str;
}

function getPieces(id) {
	redNumbers = document.getElementById("redNums").value;
	greenNumbers = document.getElementById("greenNums").value;
	if (id > 4)
		pieces = redNumbers.split(spaces);
	else
		pieces = greenNumbers.split(spaces);
	return pieces;
}

function isAvailiable(i, pieces) {
	if (i > 4)
		i -= 4;
	if (pieces[i - 1] > 0) {
		return true;
	}
	else 
		alert("You're out of that piece");
}

function getShape() {
  for (i = 1; i < 9; i++)
  	if (document.getElementById(i).classList.contains("select"))
			return i;
}

function removeClass(id) {
	document.getElementById(id).classList.remove("green");
	document.getElementById(id).classList.remove("red");
	document.getElementById(id).classList.remove("circle");
	document.getElementById(id).classList.remove("triangle");
	document.getElementById(id).classList.remove("rectangle");
	document.getElementById(id).classList.remove("square");
}

function removeGreenShapeClass() {
	document.getElementById(1).classList.remove("select");
	document.getElementById(2).classList.remove("select");
	document.getElementById(3).classList.remove("select");
	document.getElementById(4).classList.remove("select");
}

function removeRedShapeClass() {
	document.getElementById(5).classList.remove("select");
	document.getElementById(6).classList.remove("select");
	document.getElementById(7).classList.remove("select");
	document.getElementById(8).classList.remove("select");
}

function switchTurn() {
	isWinner();
	isTie();
	if ((winner || tie) && !endGame){
		if (winner)
			if (turn == TurnEnum.green)
				gameCsv += date + "," + turnNumber + ",1\n";
			else
				gameCsv += date + "," + turnNumber + ",2\n";
		else
			gameCsv += date + "," + turnNumber + ",0\n";
		//saveGame(turnsCsv, gameCsv);
		endGame = true;
	}
	if (winner) {
		cleanup();
		declareWinner();
	}
	else if (tie) {
		cleanup();
		alert("Tie game. Refresh to restart");
	}
	else if (turn == TurnEnum.green) {
		turn = TurnEnum.red
		document.getElementById("playergreen").classList.remove("green");
		document.getElementById("greenNums").classList.remove("green");
		document.getElementById("greenNumsBox").classList.remove("green");
		removeGreenShapeClass();
		document.getElementById("playerred").classList.add("red");
		document.getElementById("redNums").classList.add("red");
		document.getElementById("redNumsBox").classList.add("red");
	}
	else {
		turn = TurnEnum.green
		document.getElementById("playerred").classList.remove("red");
		document.getElementById("redNums").classList.remove("red");
		document.getElementById("redNumsBox").classList.remove("red");
		removeRedShapeClass();
		document.getElementById("playergreen").classList.add("green");
		document.getElementById("greenNums").classList.add("green");
		document.getElementById("greenNumsBox").classList.add("green");
		turnNumber += 1;
	}
}

function assignColor(id) {
	if (turn == TurnEnum.green) {
		document.getElementById(id).classList.add("green");
		turnsCsv += date + ',' + turnNumber + ",1,";
	}
	else {
		document.getElementById(id).classList.add("red");
		turnsCsv += date + ',' + turnNumber + ",2,";
	}
}

function checkShape(i, shapeid) {
	if (shapeid > 4)
		shapeid -= 4;
	var gridbutton = document.getElementById(i);
	var canTake = true;
	if (gridbutton.classList.contains("square") || (gridbutton.classList.contains("rectangle") && shapeid < 4) || (gridbutton.classList.contains("triangle") && shapeid < 3) || (gridbutton.classList.contains("circle") && shapeid == 1))
		canTake = false;
	if(!canTake)
		alert("You can't take that piece");
	return canTake;		
}

function assignShape(i, shapeid) {
	if (shapeid > 4)
		shapeid -= 4;
	var gridbutton = document.getElementById(i);
	switch (shapeid) {
		case 1: gridbutton.classList.add("circle");
		        turnsCsv += "1,"
			break;
		case 2: gridbutton.classList.add("triangle");
		        turnsCsv += "2,"
			break;
		case 3: gridbutton.classList.add("rectangle");
		        turnsCsv += "3,"
			break;
		case 4: gridbutton.classList.add("square");
		        turnsCsv += "4,";
			break;
	}
	turnsCsv += parseInt(i.toString().substring(0,1), 10)-1 + "," + (parseInt(i.toString().substring(1,2), 10)-1).toString() + "\n";
}

function isTie() {
	var greenPieces = getPieces(1);
	var redPieces = getPieces(5);
	for (i = 1; i < 9; i++) {
		if (i > 4) {
			var id = i - 4;
  		if (redPieces[id -1] > 0){
  			tie = false;
  			return;
  		}
		}
		else {
			if (greenPieces[id - 1] > 0){
				tie = false;
  			return;
			}
		}
	}
	tie = true;
}

function cleanup() {
	removeGreenShapeClass();
	removeRedShapeClass();
	document.getElementById("playergreen").classList.remove("green");
	document.getElementById("greenNums").classList.remove("green");
	document.getElementById("greenNumsBox").classList.remove("green");
	document.getElementById("playerred").classList.remove("red");
	document.getElementById("redNums").classList.remove("red");
	document.getElementById("redNumsBox").classList.remove("red");
}

function isWinner(){
	if (turn == TurnEnum.green)
		var color = "green";
	else
		var color = "red";
	winner = checkHorizontal(color) || checkVertical(color) || checkFrontSlash(color) || checkBackSlash(color);
}

function checkHorizontal(color) {
	var count = 0;
	for (i = 11; i < 16; i++){
		count = 0;
		for (j = i; j < 50; j += 10){
			if (document.getElementById(j).classList.contains(color))
				count += 1;
			if (count == 4)
				return true;
		}
		count = 0;
		for (k = i + 10; k < 60; k += 10) {
			if (document.getElementById(k).classList.contains(color))
				count += 1;
			if (count == 4)
				return true;
		}
	}
	return false;
}

function checkVertical(color) {
	var count = 0;
	for (i = 11; i < 60; i += 10){
		count = 0;
		for (j = i; j < i + 4; j += 1){
			if (document.getElementById(j).classList.contains(color))
				count += 1;
			if (count == 4)
				return true;
		}
		count = 0;
		for (k = i + 1; k < i + 5; k += 1) {
			if (document.getElementById(k).classList.contains(color))
				count += 1;
			if (count == 4)
				return true;
		}
	}
	return false;
}

function checkFrontSlash(color) {
	var count = 0;
	var timesthrough = 0;
	var num = 11;
	while (timesthrough != 4) {
		count = 0;
		for (i = num; i < num + 40; i+= 11) {
			if (document.getElementById(i).classList.contains(color))
				count += 1;
			if (count == 4)
				return true;
		}
		timesthrough += 1;
		if (timesthrough == 1)
			num = 12;
		else if (timesthrough == 2)
			num = 21;
		else
			num = 22;
	}
	return false;
}

function checkBackSlash(color) {
	var count = 0;
	var timesthrough = 0;
	var num = 14;
	while (timesthrough != 4) {
		count = 0;
		for (i = num; i < num + 30; i+= 9) {
			if (document.getElementById(i).classList.contains(color))
				count += 1;
			if (count == 4)
				return true;
		}
		timesthrough += 1;
		if (timesthrough == 1)
			num = 15;
		else if (timesthrough == 2)
			num = 24;
		else
			num = 25;
	}
	return false;
}

function declareWinner() {
	if (turn == TurnEnum.green)
		alert("Green Wins! Refresh to restart");
	else
		alert("Red Wins! Refresh to restart");
}

// function saveGame(turns, game) {
//   $.ajax({
//     url:'c4t.php',
//     type: "POST",
//     dataType:'json',
//     data: ({turn: turns, gm: game}),
//     success:function(data)
//     {
//       alert("Success!");
//     }
//   });
// }