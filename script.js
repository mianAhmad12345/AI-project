const dataset = [
  { x: 1.1, y: 39343 }, { x: 1.3, y: 46205 }, { x: 1.5, y: 37731 },
  { x: 2.0, y: 43525 }, { x: 2.2, y: 39891 }, { x: 2.9, y: 56642 },
  { x: 3.0, y: 60150 }, { x: 3.2, y: 54445 }, { x: 3.2, y: 64445 },
  { x: 3.7, y: 57189 }, { x: 3.9, y: 63218 }, { x: 4.0, y: 55794 },
  { x: 4.5, y: 56957 }, { x: 4.9, y: 57081 }, { x: 5.1, y: 61111 },
  { x: 5.3, y: 67938 }, { x: 5.9, y: 66029 }, { x: 6.0, y: 83088 },
  { x: 6.8, y: 81363 }, { x: 7.1, y: 93940 }
];

function linearRegression(data) {
  const n = data.length;
  const sumX = data.reduce((sum, p) => sum + p.x, 0);
  const sumY = data.reduce((sum, p) => sum + p.y, 0);
  const sumXY = data.reduce((sum, p) => sum + p.x * p.y, 0);
  const sumX2 = data.reduce((sum, p) => sum + p.x * p.x, 0);

  const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const b = (sumY - m * sumX) / n;
  return { m, b };
}

function predictSalary() {
  const input = document.getElementById("experience").value;
  const resultDiv = document.getElementById("result");
  if (input === "" || isNaN(input)) {
    alert("Please enter a valid number.");
    return;
  }

  const experience = parseFloat(input);
  const { m, b } = linearRegression(dataset);
  const prediction = Math.round(m * experience + b);

  const formatted = new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR"
  }).format(prediction);

  resultDiv.innerText = `Predicted Salary: ${formatted}`;
  drawChart(experience, prediction, m, b);
}

function drawChart(inputX, predY, m, b) {
  const canvas = document.getElementById("chart");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const padding = 50;
  const width = canvas.width;
  const height = canvas.height;

  const xMin = 0, xMax = 8;
  const yMin = 30000, yMax = 100000;

  const scaleX = (width - 2 * padding) / (xMax - xMin);
  const scaleY = (height - 2 * padding) / (yMax - yMin);

  // Draw grid & ticks
  ctx.strokeStyle = "#eee";
  ctx.fillStyle = "#444";
  ctx.font = "10px sans-serif";

  for (let y = yMin; y <= yMax; y += 10000) {
    const yPx = height - padding - (y - yMin) * scaleY;
    ctx.beginPath();
    ctx.moveTo(padding, yPx);
    ctx.lineTo(width - padding, yPx);
    ctx.stroke();
    ctx.fillText(`${y / 1000}k`, padding - 35, yPx + 3);
  }

  for (let x = xMin; x <= xMax; x += 1) {
    const xPx = padding + (x - xMin) * scaleX;
    ctx.beginPath();
    ctx.moveTo(xPx, padding);
    ctx.lineTo(xPx, height - padding);
    ctx.stroke();
    ctx.fillText(`${x}`, xPx - 5, height - padding + 15);
  }

  // Draw axes
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.stroke();

  // Draw data points
  dataset.forEach(point => {
    const x = padding + (point.x - xMin) * scaleX;
    const y = height - padding - (point.y - yMin) * scaleY;
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  // Draw predicted point
  const px = padding + (inputX - xMin) * scaleX;
  const py = height - padding - (predY - yMin) * scaleY;
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(px, py, 6, 0, Math.PI * 2);
  ctx.fill();

  // Draw regression line
  const x1 = xMin;
  const y1 = m * x1 + b;
  const x2 = xMax;
  const y2 = m * x2 + b;

  const lineStartX = padding + (x1 - xMin) * scaleX;
  const lineStartY = height - padding - (y1 - yMin) * scaleY;
  const lineEndX = padding + (x2 - xMin) * scaleX;
  const lineEndY = height - padding - (y2 - yMin) * scaleY;

  ctx.strokeStyle = "green";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(lineStartX, lineStartY);
  ctx.lineTo(lineEndX, lineEndY);
  ctx.stroke();

  // Axis labels
  ctx.fillStyle = "#000";
  ctx.font = "12px sans-serif";
  ctx.fillText("Years of Experience →", width / 2 - 50, height - 10);
  ctx.save();
  ctx.translate(15, height / 2 + 30);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText("Salary (PKR)", 0, 0);
  ctx.restore();
}
