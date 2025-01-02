let IsDraggingBoard = false;
let BoardDraggingStartCoordinates;
let BoardDraggingDistance = {x: 0, y: 0};
let BoardLastDraggingDistance = {x: 0, y: 0};

/* --- BOARD ---- */

$('.board-container').on('mousedown', function (e) {
    if (!$(e.target).hasClass('component') && !IsWiring) {
      IsDraggingBoard = true;
      BoardDraggingStartCoordinates = {
        x: e.pageX, 
        y: e.pageY
      };
  
      if (BoardLastDraggingDistance === undefined) { /* don't know why but it doesn't work without it */
        BoardLastDraggingDistance = {x: 0, y: 0};
      }
    }
});

/* touch */
$('.board-container').on('touchstart', function (e) {
  if (!$(e.target).hasClass('component') && !IsWiring) {
    IsDraggingBoard = true;
    const touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
    BoardDraggingStartCoordinates = {
      x: touch.pageX, 
      y: touch.pageY
    };

    if (BoardLastDraggingDistance === undefined) { /* don't know why but it doesn't work without it */
      BoardLastDraggingDistance = {x: 0, y: 0};
    }
  }
});
  
$(document).on('mouseup touchend', function (e) {
    IsDraggingBoard = false;
    BoardLastDraggingDistance = BoardDraggingDistance;
});

$(document).on('mousemove', function (e) {
  if (IsDraggingBoard && !IsWiring) {
    const x = e.pageX;
    const y = e.pageY;
    const distanceX = x - BoardDraggingStartCoordinates.x;
    const distanceY = y - BoardDraggingStartCoordinates.y;
    BoardDraggingDistance = {
      x: BoardLastDraggingDistance.x + distanceX, 
      y: BoardLastDraggingDistance.y + distanceY, 
    }
    $('.board-container').css('transform', `translate(${BoardDraggingDistance.x}px, ${BoardDraggingDistance.y}px) scale(${scale})`);
  }
});

/* touch */
$(document).on('touchmove', function (e) {
  if (IsDraggingBoard && !IsWiring) {
    const touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
    const x = touch.pageX;
    const y = touch.pageY;
    const distanceX = x - BoardDraggingStartCoordinates.x;
    const distanceY = y - BoardDraggingStartCoordinates.y;
    BoardDraggingDistance = {
      x: BoardLastDraggingDistance.x + distanceX, 
      y: BoardLastDraggingDistance.y + distanceY, 
    }
    $('.board-container').css('transform', `translate(${BoardDraggingDistance.x}px, ${BoardDraggingDistance.y}px) scale(${scale})`);
  }
});
  
  /* zooming */
  
  const ZoomSensivity = 0.1;
  let scale = 1.0;
  
  function ZoomIn() {
    let tempScale = scale + ZoomSensivity;
    tempScale = Math.round(tempScale * 10) / 10; // Round to 1 decimal after point
    if (tempScale > 0.2 && tempScale < 4) {
      $('.board-container').css('transform', `translate(${BoardDraggingDistance.x}px, ${BoardDraggingDistance.y}px) scale(${tempScale})`);
      scale = tempScale;
    }
  }
  
  function ZoomOut() {
    let tempScale = scale - ZoomSensivity;
    tempScale = Math.round(tempScale * 10) / 10; // Round to 1 decimal after point
    if (tempScale > 0.2 && tempScale < 4) {
      $('.board-container').css('transform', `translate(${BoardDraggingDistance.x}px, ${BoardDraggingDistance.y}px) scale(${tempScale})`);
      scale = tempScale;
    }
  }
  
  $('.board-container').on('wheel', function(e) {
    if (e.originalEvent.deltaY > 0) {
      /* going down */
      ZoomOut();
    } else {
      /* going up */
      ZoomIn();
    }
  });
  
  function resetWorkspace() {
    BoardLastDraggingDistance = {x: 0, y: 0};
    BoardDraggingDistance = {x: 0, y: 0};
    scale = 1;
    $('.board-container').css({'transform': 'translate(0px, 0px) scale(1)', 'transition': 'scale .5s, transform .5s'}).delay(500).queue(function(next) {
      $(this).css('transition', 'none');
      next();
    });
  }
  
  $('.board-container').dblclick(function(e) {
    if (!$(e.target).hasClass('switch')) {
      scale = 1;
      $('.board-container').css({'transform': `translate(${BoardDraggingDistance.x}px, ${BoardDraggingDistance.y}px) scale(1)`, 'transition': 'scale .5s'}).delay(500).queue(function(next) {
        $(this).css('transition', 'none');
        next();
      });
    }
  });