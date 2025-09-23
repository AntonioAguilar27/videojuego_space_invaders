// Iniciar Kaboom.js y guardarlo en la constante 'k'
const k = kaboom({
  fullscreen: true,
  scale: 1,
  background: [0, 0, 0], // Fondo negro
});

// Cargar las imágenes que vas a usar
k.loadSprite("nave", "novio2.png");
k.loadSprite("alien", "novia2.png");
k.loadSprite("corazon", "corazon.png");

// --- CAMBIO 1: INICIALIZAR MARCADOR ---
const scoreLabel = k.add([
  k.text("Score: 0"),
  k.pos(24, k.height() - 40), // Posición abajo a la izquierda
  { value: 0 }, // Propiedad para guardar el valor
]);

// Añadir el jugador (la nave) a la pantalla
const jugador = k.add([
  k.sprite("nave"),
  k.area(),
  k.pos(k.width() / 2, k.height() - 60),
  k.anchor("center"),
  k.scale(0.15),
]);

// Mover al jugador con las flechas del teclado
k.onKeyDown("left", () => {
  jugador.move(-300, 0);
});

k.onKeyDown("right", () => {
  jugador.move(300, 0);
});

// Función para disparar corazones
function disparar() {
  k.add([
    k.sprite("corazon"),
    k.area(), // Hitbox para la colisión
    k.pos(jugador.pos),
    k.anchor("center"),
    k.move(k.UP, 400),
    k.scale(0.05),
    "disparo",
  ]);
}

// Disparar al presionar la barra espaciadora
k.onKeyPress("space", disparar);

// Crear los aliens
function crearAliens() {
  for (let i = 0; i < 12; i++) {
    for (let j = 0; j < 3; j++) {
      k.add([
        k.sprite("alien"),
        k.area(), // Hitbox para la colisión
        k.pos(60 + i * 100, 40 + j * 80),
        k.scale(0.1),
        "alien",
      ]);
    }
  }
}

crearAliens();

// Mover a los aliens
let velocidadAliens = 100;
k.onUpdate("alien", (alien) => {
  alien.move(velocidadAliens, 0);
});

// Hacer que los aliens reboten en los bordes
k.loop(0.5, () => {
  let cambiarDireccion = false;
  k.get("alien").forEach((a) => {
    if (a.pos.x > k.width() - 40 || a.pos.x < 40) {
      cambiarDireccion = true;
    }
  });
  if (cambiarDireccion) {
    velocidadAliens = -velocidadAliens;
    k.get("alien").forEach((a) => {
      a.move(0, 30);
    });
  }
});

// --- CAMBIO 2: LÓGICA DE COLISIÓN MEJORADA ---
k.onCollide("disparo", "alien", (disparo, alien) => {
  k.destroy(disparo);
  k.destroy(alien);
  k.addKaboom(disparo.pos);

  // Incrementar y actualizar el marcador
  scoreLabel.value += 10;
  scoreLabel.text = "Score: " + scoreLabel.value;

  // Si ya no quedan aliens, crear una nueva oleada
  if (k.get("alien").length === 0) {
    // Opcional: Aumentar la velocidad para la siguiente ronda
    velocidadAliens = Math.abs(velocidadAliens) + 20;
    crearAliens();
  }
});
