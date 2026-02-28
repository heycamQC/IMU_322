// ==========================================
// EXPERIMENTO 1: CANVAS PURO (DIBUJANDO A TOTORO)
// ==========================================
const canvasElement = document.getElementById('canvasPuro');
const ctx = canvasElement.getContext('2d');

// 1. Fondo de bosque (Verde menta suave)
ctx.fillStyle = '#C8E6C9';
ctx.fillRect(0, 0, 400, 300);

// 2. Orejas de Totoro (Usando elipses rotadas)
ctx.fillStyle = '#788696'; // Gris oscuro
ctx.beginPath();
// ellipse(x, y, radioX, radioY, rotación, anguloInicio, anguloFin)
ctx.ellipse(160, 90, 12, 35, -0.3, 0, Math.PI * 2); // Oreja izquierda
ctx.fill();
ctx.beginPath();
ctx.ellipse(240, 90, 12, 35, 0.3, 0, Math.PI * 2); // Oreja derecha
ctx.fill();

// 3. Cuerpo principal
ctx.beginPath();
ctx.ellipse(200, 180, 85, 100, 0, 0, Math.PI * 2);
ctx.fill();

// 4. Barriga blanca
ctx.fillStyle = '#F5F5EC';
ctx.beginPath();
ctx.ellipse(200, 210, 70, 60, 0, 0, Math.PI * 2);
ctx.fill();

// 5. Marcas en la barriga (Dibujo de líneas)
ctx.strokeStyle = '#788696';
ctx.lineWidth = 3;
// Creamos una mini-función para no repetir código al dibujar las marcas
const dibujarMarca = (x, y) => {
    ctx.beginPath();
    ctx.moveTo(x - 10, y - 5); // Punto inicial
    ctx.lineTo(x, y);          // Punto medio (el pico hacia abajo)
    ctx.lineTo(x + 10, y - 5); // Punto final
    ctx.stroke();
};
dibujarMarca(200, 165); // Centro
dibujarMarca(170, 180); // Izquierda
dibujarMarca(230, 180); // Derecha

// 6. Ojos
ctx.fillStyle = '#FFFFFF';
ctx.beginPath(); ctx.arc(165, 130, 12, 0, Math.PI * 2); ctx.fill(); // Blanco izq
ctx.beginPath(); ctx.arc(235, 130, 12, 0, Math.PI * 2); ctx.fill(); // Blanco der

ctx.fillStyle = '#000000'; // Pupilas
ctx.beginPath(); ctx.arc(165, 130, 5, 0, Math.PI * 2); ctx.fill(); // Pupila izq
ctx.beginPath(); ctx.arc(235, 130, 5, 0, Math.PI * 2); ctx.fill(); // Pupila der

// 7. Nariz
ctx.beginPath();
ctx.ellipse(200, 130, 8, 4, 0, 0, Math.PI * 2);
ctx.fill();

// 8. Bigotes (Trazos simples)
ctx.strokeStyle = '#333333';
ctx.lineWidth = 2;
// Bigotes Izquierdos
ctx.beginPath(); ctx.moveTo(140, 140); ctx.lineTo(90, 130); ctx.stroke();
ctx.beginPath(); ctx.moveTo(140, 150); ctx.lineTo(90, 150); ctx.stroke();
// Bigotes Derechos
ctx.beginPath(); ctx.moveTo(260, 140); ctx.lineTo(310, 130); ctx.stroke();
ctx.beginPath(); ctx.moveTo(260, 150); ctx.lineTo(310, 150); ctx.stroke();

// 9. Un pequeño texto de firma
ctx.fillStyle = '#333333';
ctx.font = 'bold 14px Arial';
ctx.fillText('Totoro en Canvas Puro', 10, 20);

// ==========================================
// EXPERIMENTO 2: MOTOR WEB (PHASERJS CON IMAGEN REAL)
// ==========================================

const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 300,
    parent: 'contenedor-phaser',
    physics: {
        default: 'arcade',
        arcade: { 
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const juego = new Phaser.Game(config);

let avatar;
let mesa;
let cursores;

function preload() {
    // ---------------------------------------------------------
    // CARGAMOS TU IMAGEN REAL
    // Asegúrate de que el archivo se llame exactamente 'personaje.png'
    // ---------------------------------------------------------
    this.load.image('sprite_personaje', 'personaje quieto.png');
}

function create() {
    this.cameras.main.setBackgroundColor('#D4F1F4');

    // --- GENERAMOS LA MESA CON CÓDIGO (Igual que antes) ---
    let graficosMesa = this.add.graphics();
    graficosMesa.fillStyle(0x8B5A2B);
    graficosMesa.fillRect(0, 0, 100, 60);
    graficosMesa.generateTexture('img_mesa', 100, 60);
    graficosMesa.destroy();

    // --- IMPLEMENTANDO LAS FÍSICAS ---

    // 1. La Mesa (Estática)
    mesa = this.physics.add.staticImage(200, 150, 'img_mesa');

    // 2. El Avatar (Dinámico) - ¡USANDO TU IMAGEN CARGADA!
    // Usamos la clave 'sprite_personaje' que definimos en preload
    avatar = this.physics.add.image(200, 250, 'sprite_personaje');
    
    // Opcional: Si tu imagen es muy grande, puedes achicarla
    // avatar.setScale(0.5); // Descomenta esto para reducirla a la mitad

    avatar.body.setCollideWorldBounds(true);

    // 3. Colisiones
    this.physics.add.collider(avatar, mesa);

    // Activamos teclas
    cursores = this.input.keyboard.createCursorKeys();
}

function update() {
    avatar.body.setVelocity(0);

    if (cursores.left.isDown) {
        avatar.body.setVelocityX(-150);
        avatar.flipX = true; // Opcional: Voltea la imagen al ir a la izquierda
    } else if (cursores.right.isDown) {
        avatar.body.setVelocityX(150);
        avatar.flipX = false; // La regresa a la normalidad al ir a la derecha
    }

    if (cursores.up.isDown) {
        avatar.body.setVelocityY(-150);
    } else if (cursores.down.isDown) {
        avatar.body.setVelocityY(150);
    }
}

// ==========================================
// EXPERIMENTO 3: 3D CON THREE.JS (JIGGLYPUFF FINAL)
// ==========================================

// 1. Escena y Cámara
const escena = new THREE.Scene();
escena.background = new THREE.Color('#E0F7FA');

const camara = new THREE.PerspectiveCamera(75, 400 / 300, 0.1, 1000);
camara.position.set(0, 1, 4.8);
camara.lookAt(0, 0, 0);

// 2. Renderizador
const renderizador = new THREE.WebGLRenderer({ antialias: true });
renderizador.setSize(400, 300);
const contenedor = document.getElementById('contenedor-3d');
contenedor.innerHTML = '';
contenedor.appendChild(renderizador.domElement);


// --- CONSTRUYENDO A JIGGLYPUFF ---
const jigglypuff = new THREE.Group();
escena.add(jigglypuff);

// --- Materiales ---
// Ajustamos el rosa para que se parezca más al de la foto
const matRosaPiel = new THREE.MeshPhongMaterial({ color: 0xFF99CC, shininess: 35 });
const matRosaOscuro = new THREE.MeshPhongMaterial({ color: 0xCC6699 });
const matBlanco = new THREE.MeshPhongMaterial({ color: 0xFFFFFF, shininess: 50 });
// Azul más profundo para los ojos
const matAzulOjo = new THREE.MeshPhongMaterial({ color: 0x006699, shininess: 50 });
const matNegro = new THREE.MeshBasicMaterial({ color: 0x000000 }); // Negro mate para boca/pupila

// A) Cuerpo
const cuerpo = new THREE.Mesh(new THREE.SphereGeometry(1.8, 40, 40), matRosaPiel);
jigglypuff.add(cuerpo);

// B) Rulito
const rulo = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), matRosaPiel);
rulo.position.set(0, 1.3, 1.0);
jigglypuff.add(rulo);

// C) Orejas
const geoOreja = new THREE.ConeGeometry(0.45, 1.0, 32);
const geoInterior = new THREE.ConeGeometry(0.28, 0.8, 32);

const orejaIzqGrp = new THREE.Group();
orejaIzqGrp.add(new THREE.Mesh(geoOreja, matRosaPiel));
const interiorIzq = new THREE.Mesh(geoInterior, matRosaOscuro);
interiorIzq.position.set(0, -0.05, 0.18);
orejaIzqGrp.add(interiorIzq);
orejaIzqGrp.position.set(-1.0, 1.5, 0);
orejaIzqGrp.rotation.set(0, 0, 0.6);
jigglypuff.add(orejaIzqGrp);

const orejaDerGrp = orejaIzqGrp.clone();
orejaDerGrp.position.set(1.0, 1.5, 0);
orejaDerGrp.rotation.set(0, 0, -0.6);
jigglypuff.add(orejaDerGrp);

// D) Ojos (Rediseñados para ser gigantes como en la foto)
function crearOjo() {
    const ojoGrp = new THREE.Group();
    // 1. Base blanca (esclerótica)
    ojoGrp.add(new THREE.Mesh(new THREE.SphereGeometry(0.6, 32, 32), matBlanco));
    
    // 2. Iris Azul (MUY grande, casi cubre el blanco)
    const iris = new THREE.Mesh(new THREE.SphereGeometry(0.53, 32, 32), matAzulOjo);
    iris.position.z = 0.12;
    ojoGrp.add(iris);

    // 3. Pupila Negra (Pequeña)
    const pupila = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 32), matNegro);
    pupila.position.z = 0.25;
    ojoGrp.add(pupila);
    
    // 4. Brillo Blanco (Prominente)
    const brillo = new THREE.Mesh(new THREE.SphereGeometry(0.12, 24, 24), matBlanco);
    brillo.position.set(0.25, 0.25, 0.45);
    ojoGrp.add(brillo);

    // Aplastamos todo el grupo para que no sobresalga tanto
    ojoGrp.scale.set(1, 1, 0.5);
    return ojoGrp;
}

const ojoIzq = crearOjo();
ojoIzq.position.set(-0.7, 0.2, 1.55);
ojoIzq.rotation.y = -0.3;
jigglypuff.add(ojoIzq);

const ojoDer = crearOjo();
ojoDer.position.set(0.7, 0.2, 1.55);
ojoDer.rotation.y = 0.3;
jigglypuff.add(ojoDer);



// F) Brazos y Pies
const geoExtremidad = new THREE.SphereGeometry(0.4, 24, 24);
const brazoIzq = new THREE.Mesh(geoExtremidad, matRosaPiel);
brazoIzq.position.set(-1.5, -0.6, 0.7);
brazoIzq.scale.set(0.8, 1, 0.8);
jigglypuff.add(brazoIzq);
const brazoDer = brazoIzq.clone();
brazoDer.position.set(1.5, -0.6, 0.7);
jigglypuff.add(brazoDer);

const pieIzq = new THREE.Mesh(geoExtremidad, matRosaPiel);
pieIzq.position.set(-0.8, -1.7, 0.5);
pieIzq.scale.set(1.2, 0.6, 1.5); // Más planos y largos para los pies
jigglypuff.add(pieIzq);
const pieDer = pieIzq.clone();
pieDer.position.set(0.8, -1.7, 0.5);
jigglypuff.add(pieDer);


// 4. Iluminación (Suave para resaltar el volumen)
escena.add(new THREE.AmbientLight(0xffffff, 0.7));
const luzDir = new THREE.DirectionalLight(0xffffff, 0.8);
luzDir.position.set(3, 5, 5);
escena.add(luzDir);
const luzRelleno = new THREE.DirectionalLight(0xFFC0CB, 0.3); // Luz de relleno rosada
luzRelleno.position.set(-3, -2, 2);
escena.add(luzRelleno);

// 5. Bucle de Animación
function animar3D() {
    requestAnimationFrame(animar3D);
    // Rotación lenta para apreciarlo
    jigglypuff.rotation.y += 0.005;
    // Pequeño balanceo
    jigglypuff.rotation.z = Math.sin(Date.now() * 0.0015) * 0.03;
    renderizador.render(escena, camara);
}

animar3D();