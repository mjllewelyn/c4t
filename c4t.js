$(document).ready(function() {
  var turn = "green"
  var selected = ""
  var turnCount = 0
  var winner = ""
  var game = ""
  var players = "2"
  var aiBoard = makeArray(5)

  $(".player-select").on("click", function() {
    players = $(this).attr("id").split("-")[1]
    if (players == "12"){
      getAIMove()
    }
    $("#player-modal").hide()
  })

  $(".open-rules").on("click", function() {
    $("#rules-modal").show()
  })

  $(".closer").on("click", function() {
    $(this).closest(".modal").hide()
  })

  $(".player-pieces").on("click", function() {
    if (gameIsOver())
      return

    if (!$(this).hasClass(turn)) {
      alert("Not your turn")
      return
    }

    if (parseInt($("#"+$(this).attr('id') + "-left").text()) <= 0) {
      alert("You are out of that piece")
      return
    }

    selected = $(this).attr('id')
    $(".player-pieces").removeClass("select")
    $(this).addClass("select")
  })

  $(".grid-button").on("click", function() {
    if (gameIsOver())
      return

    if (selected == "") {
      alert("Please select a piece")
      return
    }

    piece = selected.split("-")[1]
    if (canTakePiece($(this), piece))
    {
      playPiece($(this), piece)

      if (winner == "" && players[0] == "1")
        getAIMove()
    }
    else{
      alert("You can't take that piece")
    }
  })

  $("#undo").on("click", function() {
    var undos = numUndos()
    for (var i = 0; i < undos; i++) {
      if (game.length > 0 && ((turnCount != 1 && players == "12") || players != "12")){
        
        var pos = game.substring(1,3)
        var x = parseInt(pos[0]) - 1
        var y = parseInt(pos[1]) - 1
        btn = $("#"+pos)
        piece = getFullPieceName(game[0])

        btn.removeClass(piece)
        game = game.substring(3)

        $(".player-pieces").removeClass("select")
        btn.removeClass("red green")
        selected = ""

        if (btn.hasClass("circle") || btn.hasClass("triangle") || btn.hasClass("rectangle")){
          if (btn.hasClass("own-piece-"+piece) || winner != ""){
            btn.addClass(turn == "green" ? "red" : "green").removeClass("own-piece-"+piece)
          }
          else
            btn.addClass(turn)
        }
        else {
          btn.addClass("none")
        }

        if (aiBoard[x][y].split("|").length == 1)
          aiBoard[x][y] = ""
        else {
          var prevMoves = aiBoard[x][y].split("|")[1]
          var mostRecent = prevMoves.split(";")[0]
          var newPiece = (mostRecent[0] == "g" ? "green-" : "red-") + getFullPieceName(mostRecent[1])
          aiBoard[x][y] = prevMoves.length < 3 ? newPiece : newPiece + "|" + prevMoves.substring(3)
        }

        turnCount--
        $("#player-"+turn+",.pieces-left-"+turn).removeClass(turn + " winner")
        if (winner == "")
          turn = turn == "green" ? "red" : "green"
        winner = ""
        $("#player-"+turn+",.pieces-left-"+turn).addClass(turn)
        $("#"+ turn + "-" + piece + "-left").text(parseInt($("#"+ turn + "-" + piece + "-left").text()) + 1)
      }
    }
  })

  function canTakePiece($btn, piece) {
    return $btn.hasClass("none") ||
        (piece == "square" && !$btn.hasClass("square")) ||
        (piece == "rectangle" && (!$btn.hasClass("square") && !$btn.hasClass("rectangle"))) ||
        (piece == "triangle" && $btn.hasClass("circle"))
  }

  function canTakeBoardPiece(x, y, piece) {
    return aiBoard[x][y] == "" ||
        (piece == "square" && !aiBoard[x][y].includes("square")) ||
        (piece == "rectangle" && (!aiBoard[x][y].includes("square") && !aiBoard[x][y].includes("rectangle"))) ||
        (piece == "triangle" && aiBoard[x][y].includes("circle"))
  }

  function playPiece($btn, piece) {
    if ($btn.hasClass(turn))
      $btn.addClass("own-piece-"+piece)
    $btn.removeClass("none red green").addClass(piece + " " + turn)
    game = piece[0]+$btn.attr("id") + game
    var x = parseInt($btn.attr("id")[0])-1
    var y = parseInt($btn.attr("id")[1])-1
    if (aiBoard[x][y].includes("red"))
      if (aiBoard[x][y].split("|").length > 1)
        aiBoard[x][y] = turn + "-" + piece + "|r" + aiBoard[x][y].split("-")[1][0] + ";" + aiBoard[x][y].split("|")[1]
      else
        aiBoard[x][y] = turn + "-" + piece + "|r" + aiBoard[x][y].split("-")[1][0]
    else if (aiBoard[x][y].includes("green"))
      if (aiBoard[x][y].split("|").length > 1)
        aiBoard[x][y] = turn + "-" + piece + "|g" + aiBoard[x][y].split("-")[1][0] + ";" + aiBoard[x][y].split("|")[1]
      else
        aiBoard[x][y] = turn + "-" + piece + "|g" + aiBoard[x][y].split("-")[1][0]
    else
      aiBoard[x][y] = turn + "-" + piece

    $("#"+selected+ "-left").text(parseInt($("#"+selected+ "-left").text()) - 1)
    $(".player-pieces").removeClass("select")
    selected = ""

    turnCount++
    $("#player-"+turn+",.pieces-left-"+turn).removeClass(turn)
    if (gameIsOver($btn.attr("id"))){
      return
    }
    else {
      turn = turn == "green" ? "red" : "green"
      $("#player-"+turn+",.pieces-left-"+turn).addClass(turn)
    }
  }

  function getFullPieceName(piece){
    switch (piece){
      case "s" : return "square"; break;
      case "r" : return "rectangle"; break;
      case "t" : return "triangle"; break;
      case "c" : return "circle"; break;
    }
    return ""
  }

  function numUndos(){
    if (players == "2" || 
        players == "11" && winner == "green" ||
        players == "12" && winner == "red")
      return 1
    return 2
  }

  function gameIsOver(btnId) {
    if (winner != "" || checkBtnWinner(btnId)){
      winner = turn
      $("#player-"+turn+",.pieces-left-"+turn).addClass("winner")
      alert((turn == "green" ? "Green" : "Red") + " Wins! Refresh to restart")
      return true
    }
    if (winner == "tie" || turnCount == 20){
      winner == "tie"
      alert("Tie game")
      return true
    }

    return false
  }

  function checkBtnWinner(btnId) {
    if (btnId == null || btnId == undefined)
      return false

    var btnX = parseInt(btnId[0])
    var btnY = parseInt(btnId[1])

    //horizontal
    var x = 1
    var y = btnY
    if (($("#"+x+y).hasClass(turn) && $("#"+(x+1)+y).hasClass(turn) && $("#"+(x+2)+y).hasClass(turn) && $("#"+(x+3)+y).hasClass(turn)) ||
       ($("#"+(x+1)+y).hasClass(turn) && $("#"+(x+2)+y).hasClass(turn) && $("#"+(x+3)+y).hasClass(turn) && $("#"+(x+4)+y).hasClass(turn)))
      return true

    //vertial
    x = btnX
    y = 1
    if (($("#"+x+y).hasClass(turn) && $("#"+x+(y+1)).hasClass(turn) && $("#"+x+(y+2)).hasClass(turn) && $("#"+x+(y+3)).hasClass(turn)) ||
       ($("#"+x+(y+1)).hasClass(turn) && $("#"+x+(y+2)).hasClass(turn) && $("#"+x+(y+3)).hasClass(turn) && $("#"+x+(y+4)).hasClass(turn)))
      return true

    //backslash /
    x = btnX
    y = btnY
    while (x < 5 || y > 1){
      x += 1
      y -= 1
    }

    if (x > 3 && y < 3){
      if ($("#"+x+y).hasClass(turn) && $("#"+(x-1)+(y+1)).hasClass(turn) && $("#"+(x-2)+(y+2)).hasClass(turn) && $("#"+(x-3)+(y+3)).hasClass(turn))
        return true
      if (x == 5 && y == 1 && $("#"+(x-1)+(y+1)).hasClass(turn) && $("#"+(x-2)+(y+2)).hasClass(turn) && $("#"+(x-3)+(y+3)).hasClass(turn) && $("#"+(x-4)+(y+4)).hasClass(turn))
        return true
    }

    //forwardslash \
    x = btnX
    y = btnY
    while (y > 1 || x > 1){
      x -= 1
      y -= 1
    }

    if (x < 3 && y < 3){
      if ($("#"+x+y).hasClass(turn) && $("#"+(x+1)+(y+1)).hasClass(turn) && $("#"+(x+2)+(y+2)).hasClass(turn) && $("#"+(x+3)+(y+3)).hasClass(turn))
        return true
      if (x == 1 && y == 1 && $("#"+(x+1)+(y+1)).hasClass(turn) && $("#"+(x+2)+(y+2)).hasClass(turn) && $("#"+(x+3)+(y+3)).hasClass(turn) && $("#"+(x+4)+(y+4)).hasClass(turn))
        return true
    }

    return false
  }

  function checkBoardWinner(color){
    //horizontal
    var x = 0
    for (var y = 0; y < 5; y++){
      if ((aiBoard[x][y].includes(color) && aiBoard[x+1][y].includes(color) && aiBoard[x+2][y].includes(color) && aiBoard[x+3][y].includes(color)) ||
        (aiBoard[x+1][y].includes(color) && aiBoard[x+2][y].includes(color) && aiBoard[x+3][y].includes(color) && aiBoard[x+4][y].includes(color)))
      return true
    }

    //vertical
    y = 0
    for (x = 0; x < 5; x++){
      if ((aiBoard[x][y].includes(color) && aiBoard[x][y+1].includes(color) && aiBoard[x][y+2].includes(color) && aiBoard[x][y+3].includes(color)) ||
        (aiBoard[x][y+1].includes(color) && aiBoard[x][y+2].includes(color) && aiBoard[x][y+3].includes(color) && aiBoard[x][y+4].includes(color)))
        return true
    }

    //backslash /
    x = 3
    y = 0
    while (x != 2){
      if ((aiBoard[x][y].includes(color) && aiBoard[x-1][y+1].includes(color) && aiBoard[x-2][y+2].includes(color) && aiBoard[x-3][y+3].includes(color)))
        return true
      if (x == 3 && y != 1)
        x = 4
      else if (x == 4){
        x = 3
        y = 1
      }
      else
        x = 2
    }


    //forwardslash \
    x = 0
    y = 0
    while (y != 2){
      if ((aiBoard[x][y].includes(color) && aiBoard[x+1][y+1].includes(color) && aiBoard[x+2][y+2].includes(color) && aiBoard[x+3][y+3].includes(color)))
        return true
      if (y == 0 && x != 1)
        y = 1
      else if (y == 1){
        x = 1
        y = 0
      }
      else
        y = 2
    }

    return false;
  }

  function getAIMove(){
    var aiPiecesLeft = new Map()
    var playerPiecesLeft = new Map()
    var aiMostPowerfulLeft = "circle"
    var playerMostPowerfulLeft = "circle"
    const pieces = ['circle','triangle','rectangle','square'];
    const oppTurn = turn == "green" ? "red" : "green"

    pieces.forEach(function(piece) {
      aiPiecesLeft.set(piece, $("#"+turn+"-"+piece+"-left").text())
      playerPiecesLeft.set(piece, $("#"+oppTurn+"-"+piece+"-left").text())
    })
    aiMostPowerfulLeft = getMostPowerfulLeft(aiPiecesLeft)
    playerMostPowerfulLeft = getMostPowerfulLeft(playerPiecesLeft)
    var finalPiece = aiMostPowerfulLeft
    var finalX = -1
    var finalY = -1
    var possible = []

    // get all possible moves and check for win
    for (var x = 0; x < 5 && finalX == -1; x++){
      for (var y = 0; y < 5 && finalX == -1; y++){
        pieces.forEach(function(piece){
          if (aiPiecesLeft.get(piece) != 0 && canTakeBoardPiece(x, y, piece)){
            if (piece == aiMostPowerfulLeft){
              possible.push(x+y.toString())
              var previousPiece = aiBoard[x][y]
              aiBoard[x][y] = turn + "-" + piece
              if (checkBoardWinner(turn)){
                finalX = x
                finalY = y
                finalPiece = piece
              }
              aiBoard[x][y] = previousPiece
            }
          }
        })
      }
    }
    //console.log("check for win; X: " + finalX + "; Y: " + finalY + "; piece: " + finalPiece)

    //check opponent 3 in a row
    for (var x = 0; x < 5 && finalX == -1; x++){
      for (var y = 0; y < 5 && finalX == -1; y++){
        if (canTakeBoardPiece(x, y, playerMostPowerfulLeft)){
          var previousPiece = aiBoard[x][y]
          aiBoard[x][y] = oppTurn + "-" + playerMostPowerfulLeft
          if (checkBoardWinner(oppTurn)){
            var pos = getOppThreeInARow(x,y, oppTurn)
            for (var i = 0; i < 3 && finalX == -1; i++){
              testX = parseInt(pos[i][0])
              testY = parseInt(pos[i][1])
              if (canTakeBoardPiece(testX,testY,aiMostPowerfulLeft)){
                finalX = testX
                finalY = testY
                finalPiece = getLeastPowerful(testX, testY, aiPiecesLeft)
              }
            }
            if (finalX == -1 && canTakeBoardPiece(x,y,aiMostPowerfulLeft)){
              finalX = x
              finalY = y
              finalPiece = getLeastPowerful(x, y, aiPiecesLeft)
            }
          }
            aiBoard[x][y] = previousPiece
        }
      }
    }
    //console.log("block; X: " + finalX + "; Y: " + finalY + "; piece: " + finalPiece)

    //otherwise random prioritize center
    if (finalX == -1){
      var new_possible = []
      possible.forEach(function(pos) {
        var x = parseInt(pos[0])
        var y = parseInt(pos[1])
        if (x > 0 && x < 4 && y > 0 && y < 4 && !aiBoard[x][y].includes(turn)){
          new_possible.push(x+y.toString())
        }
      })
      if (new_possible.length > 0)
        possible = new_possible
      var move = possible[Math.floor(Math.random()*possible.length)]
      if (move != ""){
        finalX = parseInt(move[0])
        finalY = parseInt(move[1])
        finalPiece = getLeastPowerful(finalX, finalY, aiPiecesLeft)
      }
    }

    var $btn = $("#"+(finalX+1)+(finalY+1))
    if (canTakePiece($btn, finalPiece)){
      selected = turn + "-" + finalPiece
      playPiece($btn, finalPiece)
    }
    else {
      console.log("Something went wrong; X: " + finalX + "; Y: " + finalY + "; piece: " + finalPiece + "; btn: ")
      console.log($btn)
    }
  }

  function getMostPowerfulLeft(pieces){
    if (pieces.get("square") != "0")
      return "square"
    if (pieces.get("rectangle") != "0")
      return "rectangle"
    if (pieces.get("triangle") != "0")
      return "triangle"
    return "circle"
  }

  function getLeastPowerful(x, y, pieces){
    if (aiBoard[x][y] == "" && pieces.get("circle") != "0")
      return "circle"
    if ((aiBoard[x][y] == "" || aiBoard[x][y].includes("circle")) && pieces.get("triangle") != "0")
      return "triangle"
    if (!aiBoard[x][y].includes("rectangle") && pieces.get("rectangle") != "0")
      return "rectangle"
    return "square"
  }

  function getOppThreeInARow(x,y,oppTurn){
    //north
    if (y > 2 && aiBoard[x][y-1].includes(oppTurn) && aiBoard[x][y-2].includes(oppTurn) && aiBoard[x][y-3].includes(oppTurn))
      return [(x)+(y-2).toString(), (x)+(y-1).toString(), (x)+(y-3).toString()]
    if ((y == 2 || y == 3) && aiBoard[x][y-1].includes(oppTurn) && aiBoard[x][y-2].includes(oppTurn) && aiBoard[x][y+1].includes(oppTurn))
      return [(x)+(y-1).toString(), (x)+(y+1).toString(), (x)+(y-2).toString()]

    //northeast
    if (x < 2 && y > 2 && aiBoard[x+1][y-1].includes(oppTurn) && aiBoard[x+2][y-2].includes(oppTurn) && aiBoard[x+3][y-3].includes(oppTurn))
      return [(x+2)+(y-2).toString(), (x+1)+(y-1).toString(), (x+3)+(y-3).toString()]
    if ((x == 1 || x == 2) && (y == 2 || y == 3) && aiBoard[x+1][y-1].includes(oppTurn) && aiBoard[x+2][y-2].includes(oppTurn) && aiBoard[x-1][y+1].includes(oppTurn))
      return [(x+1)+(y-1).toString(), (x-1)+(y+1).toString(), (x+2)+(y-2).toString()]

    //east
    if (x < 2 && aiBoard[x+1][y].includes(oppTurn) && aiBoard[x+2][y].includes(oppTurn) && aiBoard[x+3][y].includes(oppTurn))
      return [(x+2)+(y).toString(), (x+1)+(y).toString(), (x+3)+(y).toString()]
    if ((x == 1 || x == 2) && aiBoard[x+1][y].includes(oppTurn) && aiBoard[x+2][y].includes(oppTurn) && aiBoard[x-1][y].includes(oppTurn))
      return [(x+1)+(y).toString(), (x-1)+(y).toString(), (x+2)+(y).toString()]

    //southeast
    if (x < 2 && y < 2 && aiBoard[x+1][y+1].includes(oppTurn) && aiBoard[x+2][y+2].includes(oppTurn) && aiBoard[x+3][y+3].includes(oppTurn))
      return [(x+2)+(y+2).toString(), (x+1)+(y+1).toString(), (x+3)+(y+3).toString()]
    if ((x == 1 || x == 2) && (y == 1 || y == 2) && aiBoard[x+1][y+1].includes(oppTurn) && aiBoard[x+2][y+2].includes(oppTurn) && aiBoard[x-1][y-1].includes(oppTurn))
      return [(x+1)+(y+1).toString(), (x-1)+(y-1).toString(), (x+2)+(y+2).toString()]

    //south
    if (y < 2 && aiBoard[x][y+1].includes(oppTurn) && aiBoard[x][y+2].includes(oppTurn) && aiBoard[x][y+3].includes(oppTurn))
      return [(x)+(y+2).toString(), (x)+(y+1).toString(), (x)+(y+3).toString()]
    if ((y == 1 || y == 2) && aiBoard[x][y+1].includes(oppTurn) && aiBoard[x][y+2].includes(oppTurn) && aiBoard[x][y-1].includes(oppTurn))
      return [(x)+(y+1).toString(), (x)+(y-1).toString(), (x)+(y+2).toString()]

    //southwest
    if (x > 2 && y < 2 && aiBoard[x-1][y+1].includes(oppTurn) && aiBoard[x-2][y+2].includes(oppTurn) && aiBoard[x-3][y+3].includes(oppTurn))
      return [(x-2)+(y+2).toString(),(x-1)+(y+1).toString(),(x-3)+(y+3).toString()]
    if ((x == 2 || x == 3) && (y == 1 || y == 2) && aiBoard[x-1][y+1].includes(oppTurn) && aiBoard[x-2][y+2].includes(oppTurn) && aiBoard[x+1][y-1].includes(oppTurn))
      return [(x-1)+(y+1).toString(),(x+1)+(y-1).toString(),(x-2)+(y+2).toString()]

    //west
    if (x > 2 && aiBoard[x-1][y].includes(oppTurn) && aiBoard[x-2][y].includes(oppTurn) && aiBoard[x-3][y].includes(oppTurn))
      return [(x-2)+(y).toString(), (x-1)+(y).toString(), (x-3)+(y).toString()]
    if ((x == 2 || x == 3) && aiBoard[x-1][y].includes(oppTurn) && aiBoard[x-2][y].includes(oppTurn) && aiBoard[x+1][y].includes(oppTurn))
      return [(x-1)+(y).toString(), (x+1)+(y).toString(), (x-2)+(y).toString()]

    //northwest
    if (x > 2 && y > 2 && aiBoard[x-1][y-1].includes(oppTurn) && aiBoard[x-2][y-2].includes(oppTurn) && aiBoard[x-3][y-3].includes(oppTurn))
      return [(x-2)+(y-2).toString(), (x-1)+(y-1).toString(), (x-3)+(y-3).toString()]
    if ((x == 2 || x == 3) && (y == 2 || y == 3) && aiBoard[x-1][y-1].includes(oppTurn) && aiBoard[x-2][y-2].includes(oppTurn) && aiBoard[x+1][y+1].includes(oppTurn))
      return [(x-1)+(y-1).toString(), (x+1)+(y+1).toString(), (x-2)+(y-2).toString()]
  }

  function makeArray(dim) {
    var arr = [];
    for(let i = 0; i < dim; i++) {
        arr[i] = [];
        for(let j = 0; j < dim; j++) {
            arr[i][j] = "";
        }
    }
    return arr;
  }
});