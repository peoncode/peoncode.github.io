
function prepareCanvas()
{
  const canvasWidth = this.innerWidth-30;
  const canvasHeight = this.innerHeight-30;
  const curColor = "#cb3594";
  const canvas = document.getElementById("canvas");
  canvas.height = canvasHeight;
  canvas.width = canvasWidth;
  
  const context = canvas.getContext("2d");
  context.lineJoin = "round";
  context.lineCap = "round";
  context.lineWidth = 3;
  context.strokeStyle = curColor;

  canvas.addEventListener("mousedown", function(e) {
    this.down = true;  
    this.X = e.pageX ;
    this.Y = e.pageY ;
  });

  canvas.addEventListener("mouseup", function() {
    this.down = false;      
  });

  canvas.addEventListener("mousemove", function(e) {
    if (this.down) {
      context.beginPath();
      context.moveTo(this.X, this.Y);
      context.lineTo(e.pageX, e.pageY);
      context.stroke();
      
      this.X = e.pageX;
      this.Y = e.pageY;
    }
  });

  canvas.addEventListener("dblclick", function(e){
    context.clearRect(0, 0, canvasWidth, canvasHeight);
  });
  
  canvas.focus();
}



// function midPointBtw(p1, p2) {
//   return {
//     x: p1.x + (p2.x - p1.x) / 2,
//     y: p1.y + (p2.y - p1.y) / 2
//   };
// }

// var el = document.getElementById('c');
// var ctx = el.getContext('2d');

// ctx.lineWidth = 10;
// ctx.lineJoin = ctx.lineCap = 'round';

// var isDrawing, points = [ ];

// el.onmousedown = function(e) {
//   isDrawing = true;
//   points.push({ x: e.clientX, y: e.clientY });
// };

// el.onmousemove = function(e) {
//   if (!isDrawing) return;
  
//   points.push({ x: e.clientX, y: e.clientY });

//   ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
//   var p1 = points[0];
//   var p2 = points[1];
  
//   ctx.beginPath();
//   ctx.moveTo(p1.x, p1.y);
//   console.log(points);

//   for (var i = 1, len = points.length; i < len; i++) {
//     // we pick the point between pi+1 & pi+2 as the
//     // end point and p1 as our control point
//     var midPoint = midPointBtw(p1, p2);
//     ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
//     p1 = points[i];
//     p2 = points[i+1];
//   }
//   // Draw last line as a straight line while
//   // we wait for the next point to be able to calculate
//   // the bezier control point
//   ctx.lineTo(p1.x, p1.y);
//   ctx.stroke();
// };

// el.onmouseup = function() {
//   isDrawing = false;
//   points.length = 0;
// };