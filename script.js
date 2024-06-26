const names = loadNamesFromStorage() || [];
let winner = null;
const wheel = document.getElementById("wheel");
const winnerElement = document.getElementById("winner");
const ctx = wheel.getContext("2d");
let angle = 0;

function loadNamesFromStorage() {
  const storedNames = localStorage.getItem("names");
  return storedNames ? JSON.parse(storedNames) : [];
}

function saveNamesToStorage() {
  localStorage.setItem("names", JSON.stringify(names));
}

function addName() {
  const nameInput = document.getElementById("nameInput");
  const name = nameInput.value.trim();
  if (name) {
    names.push(name);
    nameInput.value = "";
    saveNamesToStorage();
    updateNameList();
    drawWheel();
  }
}

function removeName(index) {
  names.splice(index, 1);
  saveNamesToStorage();
  updateNameList();
  drawWheel();
}

function updateNameList() {
  const nameList = document.getElementById("nameList");
  nameList.innerHTML = "";
  names.forEach((name, index) => {
    const li = document.createElement("li");
    li.textContent = name;

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.className = "ml-2 text-red-600";
    removeButton.addEventListener("click", () => removeName(index));

    li.appendChild(removeButton);
    nameList.appendChild(li);
  });
}
updateNameList();

function drawWheel() {
  const numSegments = names.length;
  const segmentAngle = (2 * Math.PI) / numSegments;
  const centerX = wheel.width / 2;
  const centerY = wheel.height / 2;
  const radius = wheel.width / 2;
  const circleRadius = 40;
  const textSize = 18;

  ctx.clearRect(0, 0, wheel.width, wheel.height);

  for (let i = 0; i < numSegments; i++) {
    const startAngle = i * segmentAngle;
    const endAngle = startAngle + segmentAngle;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();

    ctx.fillStyle = `hsl(${(i * 360) / numSegments}, 100%, 50%)`;
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(startAngle + segmentAngle / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.fillText(names[i], radius - 10, 10);
    ctx.restore();
  }

  ctx.beginPath();
  ctx.arc(centerX, centerY, circleRadius, 0, 2 * Math.PI);
  ctx.fillStyle = "#000";
  ctx.fill();
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#fff";
  ctx.font = `${textSize}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText("Winner", centerX, centerY - 10);

  if (winner !== null) {
    ctx.fillText(winner, centerX, centerY + 10);
  }
}

function spin() {
  if (names.length === 0) {
    return alert("Add some names first!");
  }

  const spinAngle = Math.random() * 360 + 360 * 5;
  const duration = 5786;
  const start = performance.now();

  function animate(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutCubic(progress);

    angle = (spinAngle * easedProgress) % 360;
    wheel.style.transform = `rotate(${angle}deg)`;

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      const selectedNameIndex = Math.floor(
        ((360 - (angle % 360)) / 360) * names.length
      );
      winner = names[selectedNameIndex];
      winnerElement.classList.add("p-3");
      winnerElement.textContent = `Winner: ${winner}`;
      drawWheel();
    }
  }

  requestAnimationFrame(animate);
}

function easeOutCubic(t) {
  return --t * t * t + 1;
}

drawWheel();
