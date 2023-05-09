var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

const points3d = [
  // Coordinates of penalty area points
  [0, 0],
  [16.5, 0],
  [16.5, 40],
  [0, 40],
];
const points2d = [
  // Coordinates of the same points on screen
  [743, 303],
  [485, 348],
  [223, 197],
  [424, 174],
];
var projectionCalculator2d = new Projection3d2d.ProjectionCalculator2d(
  points3d,
  points2d
);
console.log(projectionCalculator2d);

var draw = () => {
  drawBackground();
  drawGrid();
};

var drawBackground = () => {
  ctx.globalAlpha = 1;
  if (image) {
    ctx.drawImage(image, 0, 0, 1000, 625);
  }
};

var drawGrid = (step = 5, mouseX = undefined, mouseY = undefined) => {
  ctx.strokeStyle = '#FFFFFF';

  if (mouseX && mouseY) {
    const grad = ctx.createRadialGradient(
      mouseX,
      mouseY,
      0,
      mouseX,
      mouseY,
      65
    );
    grad.addColorStop(0, '#FFFFFF');
    grad.addColorStop(1, 'transparent');
    ctx.strokeStyle = grad;
    ctx.globalAlpha = 0.5;
  } else {
    ctx.globalAlpha = 0.2;
  }
  ctx.beginPath();
  for (var x = 0; x <= 105; x += step) {
    var point2d_1 = projectionCalculator2d.getProjectedPoint([x, -13]);
    var point2d_2 = projectionCalculator2d.getProjectedPoint([x, 55]);
    ctx.moveTo(point2d_1[0], point2d_1[1]);
    ctx.lineTo(point2d_2[0], point2d_2[1]);
  }
  for (var y = -13; y <= 55; y += step) {
    var point2d_1 = projectionCalculator2d.getProjectedPoint([0, y]);
    var point2d_2 = projectionCalculator2d.getProjectedPoint([105, y]);
    ctx.moveTo(point2d_1[0], point2d_1[1]);
    ctx.lineTo(point2d_2[0], point2d_2[1]);
  }
  ctx.stroke();
};

var drawCoordinates = (mouseX, mouseY) => {
  var point3d = projectionCalculator2d.getUnprojectedPoint([
    mouseX,
    mouseY,
  ]);
  var x3d = Math.round(point3d[0] * 10) / 10;
  var y3d = Math.round(point3d[1] * 10) / 10;
  var text = 'X: ' + x3d + ' m., Y: ' + y3d + ' m.';
  ctx.globalAlpha = 1;
  ctx.font = '21px Arial';
  ctx.strokeStyle = 'black';
  ctx.strokeText(text, mouseX + 2, mouseY - 2);
  ctx.fillStyle = 'white';
  ctx.fillText(text, mouseX + 2, mouseY - 2);
};
let image = new Image();

const inputElement = document.querySelector('input[type="file"]');
const imgElement = document.querySelector('img');

inputElement.addEventListener('change', (event) => {
  const file = event.target.files[0];

  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = () => {
    image.src = reader.result;
    image.onload = () => {
      draw();
    };
  };
});

canvas.onmousemove = (evt) => {
  var mouseX = evt.offsetX;
  var mouseY = evt.offsetY;
  draw();
  drawGrid(1, mouseX, mouseY);
  drawCoordinates(mouseX, mouseY);
};