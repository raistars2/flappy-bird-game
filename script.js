const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const restartContainer = document.getElementById("restartContainer");
const restartButton = document.getElementById("restartButton");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let bird, pipes = [], score = 0, gameStarted = true;
const birdWidth = 50, birdHeight = 50;
const pipeGap = 200, pipeSpeed = 2;  // Memperlebar jarak antar pipa dan memperlambat kecepatan pipa

// Memuat Gambar Burung
const birdImg = new Image();
birdImg.src = 'bird.png'; // Pastikan gambar burung sudah ada dengan nama bird.png

// Fungsi untuk reset game
function resetGame() {
    bird = { x: 50, y: canvas.height / 2, width: birdWidth, height: birdHeight, velocity: 0 };
    pipes = [];
    score = 0;
    gameStarted = true;
    restartContainer.style.display = "none";
    updateScore();
}

// Fungsi untuk menampilkan skor
function updateScore() {
    document.title = `Flappy Bird - Skor: ${score}`; // Tampilkan skor di title browser
}

// Fungsi untuk membuat pipa baru
function createPipe() {
    const pipeHeight = Math.random() * (canvas.height - pipeGap - 100);  // Menghasilkan tinggi pipa secara acak dengan tinggi yang lebih rendah
    pipes.push({
        x: canvas.width,
        y: pipeHeight,
        width: 60,
        height: canvas.height - pipeHeight - pipeGap  // Pipa bawah
    });
}

// Fungsi untuk menggambar burung
function drawBird() {
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

// Fungsi untuk menggambar pipa
function drawPipes() {
    pipes.forEach(pipe => {
        // Pipa atas
        ctx.fillStyle = 'green';
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.y);

        // Pipa bawah
        ctx.fillRect(pipe.x, pipe.y + pipeGap, pipe.width, canvas.height - (pipe.y + pipeGap));

        // Gerakkan pipa ke kiri
        pipe.x -= pipeSpeed;

        // Hapus pipa yang sudah keluar layar
        if (pipe.x + pipe.width < 0) pipes.shift();
    });
}

// Fungsi untuk mendeteksi tabrakan
function detectCollisions() {
    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        endGame();
    }

    pipes.forEach(pipe => {
        if (
            bird.x + bird.width > pipe.x &&
            bird.x < pipe.x + pipe.width &&
            (bird.y < pipe.y || bird.y + bird.height > pipe.y + pipeGap)
        ) {
            endGame();
        }
    });
}

// Fungsi untuk mengakhiri game
function endGame() {
    gameStarted = false;
    restartContainer.style.display = "flex";
}

// Fungsi untuk menggerakkan burung
document.addEventListener("keydown", () => {
    if (gameStarted) {
        bird.velocity = -7;  // Kecepatan lompatan burung
    }
});

document.addEventListener("click", () => {
    if (gameStarted) {
        bird.velocity = -4;  // Kecepatan lompatan burung
    }
});

// Fungsi untuk memperbarui status game
function updateGame() {
    if (!gameStarted) return;

    bird.velocity += 0.1;  // Perlambat gravitasi
    bird.y += bird.velocity;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBird();
    drawPipes();
    detectCollisions();

    requestAnimationFrame(updateGame);
}

// Fungsi untuk memulai ulang game
restartButton.addEventListener("click", () => {
    resetGame();
    updateGame();
});

// Mulai game
setInterval(createPipe, 2000); // Membuat pipa setiap 2 detik
resetGame();
updateGame();
