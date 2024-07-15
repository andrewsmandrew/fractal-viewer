
var canvas = document.getElementById("canvas").getContext("2d");

function setPixel(canvas, x, y, color = "black", size) {
  canvas.fillStyle = color;
  canvas.fillRect(x, y, size, size);
}

function inSet(z0, iterations = 100, infinity = 10 ** 8) {
  // A fucntion to test if a complex number is within the Mandelbrot Set

  // z0 - a complex number to be used as the starting condition to be tested
  // iterations - how many iterations of the formula are tested
  // infinity - the experimental definition of infinity

  //**DEPENDENT ON THE MATHJS LIBRARY
  // if (z0.re < -2 || z0.re > 1 || z0.im > 1 || z0.im < -1) {
  //   return iterations;
  // }
  zn = z0;
  for (let i = 0; i < iterations; i++) {
    zn = math.add(math.pow(zn, 2), z0);
    if (Math.abs(zn.re) > infinity || Math.abs(zn.im) > infinity) {
      return i;
    }
  }
  return 0;
}

const canvas_width = 400;
const canvas_height = 400;
let domain_min = -2;
let domain_max = 2;
let range_min = -2;
let range_max = 2;

let timeout = [];


function drawFrame(resolution = 1, timeoutBool = true, pixel_y = 0) {
  let domain = domain_max - domain_min;
  let range = range_max - range_min;
  let domain_scale = domain / canvas_width;
  let range_scale = domain / canvas_height;
  let x_transform = (domain_min + domain_max) / 2;
  let y_transform = (range_min + range_max) / 2;


  for(let pixel_x = 0; pixel_x < canvas_width; pixel_x += resolution){ 

    let x = pixel_x * domain_scale - domain / 2 + x_transform;
    let y = pixel_y * range_scale - range / 2 + y_transform;
    let color = "white";
    if (x == 0 && pixel_y % (2 * resolution) == 0) {
      color = "black";
    } else if (y == 0 && pixel_x % (2 * resolution) == 0) {
      color = "black";
    } else {
      let distance = inSet(math.complex(x, y), 75 + (1/domain));
      let value = distance*3;
      //color = "rgba(" + value + " " + value +" " + value +")";
      color = "hsl("+ value +" 100% 50%)";
      if (distance == 0) {
        color = "black";
      }
    }



    setPixel(canvas, pixel_x, canvas_height - pixel_y, color, resolution);
  }

  if(pixel_y < canvas_height){
    if(timeoutBool){
      timeout.push(setTimeout( () => {drawFrame(resolution, true, pixel_y += resolution)} ));
    } else {
      drawFrame(resolution, false, pixel_y += resolution);
    }
  }
}

function update() {
  for(let i = 0; i < timeout.length; i++){
    clearTimeout(timeout[i]);
  }
  timeout = [];
  drawFrame(8, false, 0, 4);
  drawFrame(2);
  drawFrame(1);
}

function zoom(percentage) {
  amountDomain = (domain_max - domain_min) * percentage;
  amountRange = (domain_max - domain_min) * percentage;
  domain_max -= amountDomain;
  domain_min += amountDomain;
  range_max -= amountRange;
  range_min += amountRange;
  update();
}
document.getElementById("increase").addEventListener("click", () => {
  zoom(0.25);
});
document.getElementById("decrease").addEventListener("click", () => {
  zoom(-0.25);
});

function translateX(percentage) {
  let translation = (domain_max - domain_min) * percentage;
  domain_max += translation;
  domain_min += translation;
  update();
}

function translateY(percentage) {
  let translation = (range_max - range_min) * percentage;
  range_max += translation;
  range_min += translation;
  update();
}

document.getElementById("left").addEventListener("click", () => {
  translateX(-0.25);
});
document.getElementById("right").addEventListener("click", () => {
  translateX(0.25);
});
document.getElementById("up").addEventListener("click", () => {
  translateY(0.25);
});
document.getElementById("down").addEventListener("click", () => {
  translateY(-0.25);
});

document.addEventListener("keydown", (e) => {
    let key = e.key;
    switch(key){
      case "ArrowUp":
        translateY(0.25);
        break;
      case "ArrowDown":
        translateY(-0.25);
        break;
      case "ArrowLeft":
        translateX(-0.25);
        break;
      case "ArrowRight":
        translateX(0.25);
        break;
      case "=":
        zoom(0.25);
        break;
      case "+":
        zoom(0.25);
        break;
      case "-":
        zoom(-0.25);
        break;
      case "_":
        zoom(-0.25);
        break;
    }
  });

update();
