// Iniciar Kaboom.js y guardarlo en la constante 'k'
const k = kaboom({
  fullscreen: true,
  scale: 1,
});

// Cargar las imágenes que vas a usar (esto se hace una sola vez al inicio)
k.loadSprite("nave", "novio2.png");
k.loadSprite("alien", "novia2.png");
k.loadSprite("corazon", "corazon.png");
k.loadSprite("background", "background.jpg");

// --- ESCENA 1: MENÚ PRINCIPAL ---
k.scene("menu", () => {
  // Dibuja el fondo ocupando toda la pantalla
  const bg = k.add([k.sprite("background"), k.pos(0, 0), k.z(-1)]);

  // Esperamos un fotograma para asegurar que bg.width y bg.height estén listos
  k.wait(0, () => {
    bg.scale = k.vec2(k.width() / bg.width, k.height() / bg.height);
  });

  // Añade el botón de "Comenzar"
  const startButton = k.add([
    k.rect(240, 60, { radius: 8 }),
    k.pos(k.center()),
    k.anchor("center"),
    k.area(),
    k.color(100, 100, 255),
    "startButton",
  ]);

  // Añade el texto del botón
  k.add([
    k.text("Comenzar a Jugar", { size: 28 }),
    k.pos(k.center()),
    k.anchor("center"),
    k.color(255, 255, 255),
  ]);

  // Cuando se hace clic en el botón, cambia a la escena del juego
  k.onClick("startButton", () => {
    k.go("juego");
  });
});

// --- ESCENA 2: EL JUEGO ---
k.scene("juego", () => {
  // Dibuja el fondo ocupando toda la pantalla
  const bg = k.add([k.sprite("background"), k.pos(0, 0), k.z(-1)]);

  // Esperamos un fotograma para asegurar que bg.width y bg.height estén listos
  k.wait(0, () => {
    bg.scale = k.vec2(k.width() / bg.width, k.height() / bg.height);
  });

  const scoreLabel = k.add([
    k.text("Score: 0"),
    k.pos(24, k.height() - 40),
    { value: 0 },
  ]);

  const jugador = k.add([
    k.sprite("nave"),
    k.area(),
    k.pos(k.width() / 2, k.height() - 60),
    k.anchor("center"),
    k.scale(0.25),
  ]);

  k.onKeyDown("left", () => {
    jugador.move(-300, 0);
  });

  k.onKeyDown("right", () => {
    jugador.move(300, 0);
  });

  function disparar() {
    k.add([
      k.sprite("corazon"),
      k.area(),
      k.pos(jugador.pos),
      k.anchor("center"),
      k.move(k.UP, 400),
      k.scale(0.05),
      "disparo",
    ]);
  }

  k.onKeyPress("space", disparar);

  function crearAliens() {
    for (let i = 0; i < 12; i++) {
      for (let j = 0; j < 4; j++) {
        k.add([
          k.sprite("alien"),
          k.area(),
          k.pos(60 + i * 100, 40 + j * 80),
          k.scale(0.2),
          "alien",
        ]);
      }
    }
  }

  crearAliens();

  let velocidadAliens = 100;
  k.onUpdate("alien", (alien) => {
    alien.move(velocidadAliens, 0);
  });

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

  k.onCollide("disparo", "alien", (disparo, alien) => {
    k.destroy(disparo);
    k.destroy(alien);
    k.addKaboom(disparo.pos);
    scoreLabel.value += 10;
    scoreLabel.text = "Score: " + scoreLabel.value;
    if (k.get("alien").length === 0) {
      velocidadAliens = Math.abs(velocidadAliens) + 20;
      crearAliens();
    }
  });
});

// --- INICIAR EL JUEGO ---
// Le decimos a Kaboom que empiece en la escena del menú
k.go("menu");
