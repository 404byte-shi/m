import * as THREE from "three";

import { OrbitControls } from
  "https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/controls/OrbitControls.js";


/* =====================================================
   DOM
===================================================== */

const app =
  document.getElementById("app");

const chapter =
  document.getElementById("chapter");

const eyebrow =
  document.getElementById("eyebrow");

const title =
  document.getElementById("title");

const description =
  document.getElementById("description");

const actionButton =
  document.getElementById("actionButton");

const backButton =
  document.getElementById("backButton");

const interactionHint =
  document.getElementById(
    "interactionHint"
  );


/* =====================================================
   SCENE
===================================================== */

const scene =
  new THREE.Scene();


scene.background =
  new THREE.Color(
    0x02030b
  );


scene.fog =
  new THREE.FogExp2(
    0x02030b,
    0.012
  );


/* =====================================================
   CAMERA
===================================================== */

const camera =
  new THREE.PerspectiveCamera(
    55,

    window.innerWidth /
      window.innerHeight,

    0.1,

    2000
  );


camera.position.set(
  0,
  14,
  46
);


/* =====================================================
   RENDERER
===================================================== */

const renderer =
  new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance"
  });


renderer.setPixelRatio(
  Math.min(
    window.devicePixelRatio,
    1.7
  )
);


renderer.setSize(
  window.innerWidth,
  window.innerHeight
);


renderer.outputColorSpace =
  THREE.SRGBColorSpace;


renderer.toneMapping =
  THREE.ACESFilmicToneMapping;


renderer.toneMappingExposure =
  1.15;


app.appendChild(
  renderer.domElement
);


/* =====================================================
   CONTROLS
===================================================== */

const controls =
  new OrbitControls(
    camera,
    renderer.domElement
  );


controls.enableDamping =
  true;


controls.dampingFactor =
  0.06;


controls.enablePan =
  false;


controls.minDistance =
  4;


controls.maxDistance =
  100;


/* =====================================================
   LIGHTING
===================================================== */

scene.add(
  new THREE.AmbientLight(
    0x8b8ba8,
    1.1
  )
);


const sunLight =
  new THREE.PointLight(
    0xffc66d,
    50,
    180
  );


scene.add(
  sunLight
);


/* =====================================================
   MATERIAL HELPERS
===================================================== */

function material(
  color,
  emissive = 0,
  intensity = 0
) {

  return new THREE.MeshStandardMaterial({

    color,

    roughness: 0.65,

    metalness: 0.05,

    emissive,

    emissiveIntensity:
      intensity
  });

}


function sphere(
  radius,
  color,
  emissive = 0,
  intensity = 0
) {

  return new THREE.Mesh(

    new THREE.SphereGeometry(
      radius,
      32,
      24
    ),

    material(
      color,
      emissive,
      intensity
    )

  );

}


/* =====================================================
   3D LABEL
===================================================== */

function createLabel(
  text,
  color = "#ffffff"
) {

  const canvas =
    document.createElement(
      "canvas"
    );


  canvas.width = 700;
  canvas.height = 150;


  const ctx =
    canvas.getContext("2d");


  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  ctx.font =
    "700 62px Arial";


  ctx.fillStyle =
    color;


  ctx.textAlign =
    "center";


  ctx.textBaseline =
    "middle";


  ctx.shadowColor =
    "rgba(255,255,255,.5)";


  ctx.shadowBlur = 15;


  ctx.fillText(
    text,
    canvas.width / 2,
    canvas.height / 2
  );


  const texture =
    new THREE.CanvasTexture(
      canvas
    );


  texture.colorSpace =
    THREE.SRGBColorSpace;


  const sprite =
    new THREE.Sprite(

      new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: false
      })

    );


  sprite.scale.set(
    5,
    1.07,
    1
  );


  return sprite;

}


/* =====================================================
   STAR FIELD
===================================================== */

const starGeometry =
  new THREE.BufferGeometry();


const STAR_COUNT =
  2500;


const positions =
  new Float32Array(
    STAR_COUNT * 3
  );


for (
  let i = 0;
  i < STAR_COUNT;
  i++
) {

  const radius =
    100 +
    Math.random() * 450;


  const theta =
    Math.random() *
    Math.PI *
    2;


  const phi =
    Math.acos(
      2 *
      Math.random() -
      1
    );


  positions[i * 3] =
    radius *
    Math.sin(phi) *
    Math.cos(theta);


  positions[
    i * 3 + 1
  ] =
    radius *
    Math.cos(phi);


  positions[
    i * 3 + 2
  ] =
    radius *
    Math.sin(phi) *
    Math.sin(theta);

}


starGeometry.setAttribute(

  "position",

  new THREE.BufferAttribute(
    positions,
    3
  )

);


const stars =
  new THREE.Points(

    starGeometry,

    new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.7,
      transparent: true,
      opacity: 0.8
    })

  );


scene.add(
  stars
);


/* =====================================================
   SOLAR SYSTEM
===================================================== */

const solarSystem =
  new THREE.Group();


scene.add(
  solarSystem
);


/* =====================================================
   SUN
===================================================== */

const sun =
  sphere(
    3.3,
    0xffa52e,
    0xff6500,
    2.5
  );


solarSystem.add(
  sun
);


/* =====================================================
   PLANETS
===================================================== */

const planets = [];


const planetData = [

  {
    distance: 8,
    size: 0.5,
    color: 0xaeb3bd,
    speed: 0.30
  },

  {
    distance: 11,
    size: 0.7,
    color: 0xd1a87b,
    speed: 0.24
  },

  {
    distance: 15,
    size: 1.3,
    color: 0x477fff,
    speed: 0.17,
    her: true
  },

  {
    distance: 20,
    size: 0.75,
    color: 0xb94c3c,
    speed: 0.12
  },

  {
    distance: 28,
    size: 2.2,
    color: 0xc39b69,
    speed: 0.07
  }

];


planetData.forEach(
  (data) => {

    /* Orbit */

    const orbit =
      new THREE.Mesh(

        new THREE.RingGeometry(
          data.distance -
            0.012,

          data.distance +
            0.012,

          120
        ),

        new THREE.MeshBasicMaterial({
          color: 0x737384,
          transparent: true,
          opacity: 0.18,
          side: THREE.DoubleSide
        })

      );


    orbit.rotation.x =
      Math.PI / 2;


    solarSystem.add(
      orbit
    );


    /* Planet */

    const planet =
      sphere(
        data.size,
        data.color,

        data.her
          ? 0x173a9c
          : 0,

        data.her
          ? 0.8
          : 0
      );


    planet.userData.distance =
      data.distance;


    planet.userData.speed =
      data.speed;


    planet.userData.her =
      Boolean(data.her);


    planet.userData.angle =
      Math.random() *
      Math.PI *
      2;


    solarSystem.add(
      planet
    );


    planets.push(
      planet
    );


    /* HER */

    if (data.her) {

      const herLabel =
        createLabel(
          "HER"
        );


      herLabel.position.y =
        2.1;


      planet.add(
        herLabel
      );


      /* ME */

      const me =
        sphere(
          0.42,
          0xff69ae,
          0xff267d,
          2.5
        );


      me.userData.me =
        true;


      me.position.set(
        2.5,
        0,
        0
      );


      planet.add(
        me
      );


      const meLabel =
        createLabel(
          "ME",
          "#ffb6d7"
        );


      meLabel.scale.set(
        2.8,
        0.6,
        1
      );


      meLabel.position.y =
        0.8;


      me.add(
        meLabel
      );

    }

  }
);


/* =====================================================
   INDIA
===================================================== */

const india =
  new THREE.Group();


india.visible =
  false;


scene.add(
  india
);


/*
   Stylized India shape.

   Later we can replace this
   with an actual 3D geographic
   model.
*/

const indiaShape =
  new THREE.Shape();


indiaShape.moveTo(
  -5,
  4
);


indiaShape.lineTo(
  -2,
  5
);


indiaShape.lineTo(
  1,
  4.3
);


indiaShape.lineTo(
  4,
  1
);


indiaShape.lineTo(
  2,
  -2
);


indiaShape.lineTo(
  1,
  -6
);


indiaShape.lineTo(
  -1,
  -4
);


indiaShape.lineTo(
  -3,
  -2
);


indiaShape.lineTo(
  -4,
  1
);


indiaShape.closePath();


const indiaGeometry =
  new THREE.ExtrudeGeometry(

    indiaShape,

    {
      depth: 0.6,

      bevelEnabled: true,

      bevelSize: 0.15,

      bevelThickness: 0.12
    }

  );


const indiaMesh =
  new THREE.Mesh(

    indiaGeometry,

    material(
      0x56704e
    )

  );


indiaMesh.rotation.x =
  -Math.PI / 2;


india.add(
  indiaMesh
);


/* =====================================================
   PATNA
===================================================== */

const patna =
  sphere(
    0.4,
    0xff6eaf,
    0xff2d86,
    3
  );


patna.userData.patna =
  true;


patna.position.set(
  0.5,
  0.8,
  1.3
);


india.add(
  patna
);


const patnaLabel =
  createLabel(
    "PATNA"
  );


patnaLabel.position.y =
  1.1;


patna.add(
  patnaLabel
);


/* =====================================================
   PATNA CITY
===================================================== */

const city =
  new THREE.Group();


city.visible =
  false;


scene.add(
  city
);


/* Ground */

const ground =
  new THREE.Mesh(

    new THREE.PlaneGeometry(
      42,
      30
    ),

    material(
      0x17231d
    )

  );


ground.rotation.x =
  -Math.PI / 2;


city.add(
  ground
);


/* =====================================================
   GANGA
===================================================== */

const ganga =
  new THREE.Mesh(

    new THREE.PlaneGeometry(
      42,
      6
    ),

    material(
      0x24506b
    )

  );


ganga.rotation.x =
  -Math.PI / 2;


ganga.position.set(
  0,
  0.03,
  7
);


city.add(
  ganga
);


/* =====================================================
   CITY BUILDINGS
===================================================== */

for (
  let i = 0;
  i < 45;
  i++
) {

  const width =
    0.8 +
    Math.random() * 1.6;


  const height =
    0.5 +
    Math.random() * 2.4;


  const depth =
    0.8 +
    Math.random() * 1.5;


  const building =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        width,
        height,
        depth
      ),

      material(
        0x4d4b54
      )

    );


  building.position.set(

    -19 +
      Math.random() * 38,

    height / 2,

    -8 +
      Math.random() * 14

  );


  city.add(
    building
  );

}


/* =====================================================
   GOLGHAR
===================================================== */

const golghar =
  new THREE.Group();


golghar.userData.golghar =
  true;


golghar.position.set(
  0,
  0.1,
  -2
);


/* Base */

const golgharBase =
  new THREE.Mesh(

    new THREE.CylinderGeometry(
      2.3,
      2.5,
      1,
      40
    ),

    material(
      0xc68c55
    )

  );


golgharBase.position.y =
  0.5;


golghar.add(
  golgharBase
);


/* Dome */

const dome =
  new THREE.Mesh(

    new THREE.SphereGeometry(
      2.5,
      40,
      24,

      0,
      Math.PI * 2,

      0,
      Math.PI / 2
    ),

    material(
      0xb97840
    )

  );


dome.scale.y =
  1.2;


dome.position.y =
  1;


golghar.add(
  dome
);


/* =====================================================
   SPIRAL STAIRCASE
===================================================== */

for (
  let i = 0;
  i < 120;
  i++
) {

  const angle =
    (i / 120) *
    Math.PI *
    5.2;


  const y =
    0.35 +
    (i / 120) *
    4.5;


  const stair =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        0.16,
        0.045,
        0.55
      ),

      material(
        0x795238
      )

    );


  stair.position.set(

    Math.cos(angle) *
      2.65,

    y,

    Math.sin(angle) *
      2.65

  );


  stair.rotation.y =
    -angle;


  golghar.add(
    stair
  );

}


/* Label */

const golgharLabel =
  createLabel(
    "GOLGHAR",
    "#ffe1ae"
  );


golgharLabel.position.y =
  5;


golghar.add(
  golgharLabel
);


city.add(
  golghar
);


/* =====================================================
   STATE
===================================================== */

let currentScene =
  "space";


let travelling =
  false;


/* =====================================================
   UI
===================================================== */

function updateUI({

  chapterText,

  eyebrowText,

  titleText,

  descriptionText,

  buttonText,

  hintText

}) {

  chapter.textContent =
    chapterText;


  eyebrow.textContent =
    eyebrowText;


  title.textContent =
    titleText;


  description.textContent =
    descriptionText;


  actionButton.textContent =
    buttonText;


  interactionHint.textContent =
    hintText;

}


/* =====================================================
   CAMERA TRAVEL
===================================================== */

function cameraTravel(
  destination,
  target,
  callback
) {

  travelling =
    true;


  controls.enabled =
    false;


  const startPosition =
    camera.position.clone();


  const startTarget =
    controls.target.clone();


  const startTime =
    performance.now();


  const duration =
    1700;


  function animateTravel(
    time
  ) {

    const progress =
      Math.min(

        (time - startTime) /
          duration,

        1

      );


    const eased =
      1 -
      Math.pow(
        1 - progress,
        4
      );


    camera.position.lerpVectors(

      startPosition,

      destination,

      eased

    );


    controls.target.lerpVectors(

      startTarget,

      target,

      eased

    );


    controls.update();


    if (
      progress < 1
    ) {

      requestAnimationFrame(
        animateTravel
      );

    } else {

      travelling =
        false;

      controls.enabled =
        true;

      callback?.();

    }

  }


  requestAnimationFrame(
    animateTravel
  );

}


/* =====================================================
   ENTER INDIA
===================================================== */

function enterIndia() {

  currentScene =
    "india";


  solarSystem.visible =
    false;


  india.visible =
    true;


  city.visible =
    false;


  camera.position.set(
    0,
    10,
    25
  );


  controls.target.set(
    0,
    0,
    0
  );


  controls.minDistance =
    5;


  controls.maxDistance =
    60;


  updateUI({

    chapterText:
      "02 · INDIA",

    eyebrowText:
      "CHAPTER TWO · HER SIDE OF THE WORLD",

    titleText:
      "Find her in India.",

    descriptionText:
      "The universe is getting smaller. Somewhere in this glowing map is the city where her story continues.",

    buttonText:
      "Find Patna →",

    hintText:
      "Tap the glowing PATNA marker"

  });


  backButton.style.display =
    "block";

}


/* =====================================================
   ENTER PATNA
===================================================== */

function enterPatna() {

  currentScene =
    "patna";


  india.visible =
    false;


  city.visible =
    true;


  camera.position.set(
    0,
    14,
    29
  );


  controls.target.set(
    0,
    0,
    0
  );


  controls.minDistance =
    6;


  controls.maxDistance =
    65;


  updateUI({

    chapterText:
      "03 · PATNA",

    eyebrowText:
      "CHAPTER THREE · PATNA",

    titleText:
      "Welcome to Patna.",

    descriptionText:
      "Now we're closer. Explore the little city and find the place waiting for you.",

    buttonText:
      "Find the destination →",

    hintText:
      "Tap Golghar"

  });

}


/* =====================================================
   ENTER GOLGHAR
===================================================== */

function enterGolghar() {

  currentScene =
    "golghar";


  updateUI({

    chapterText:
      "04 · GOLGHAR",

    eyebrowText:
      "CHAPTER FOUR · THE DESTINATION",

    titleText:
      "We found it.",

    descriptionText:
      "Golghar — recreated here as our first 3D destination. This is where your birthday journey can begin its next chapter.",

    buttonText:
      "Continue →",

    hintText:
      "The journey continues…"

  });


  cameraTravel(

    new THREE.Vector3(
      6,
      5,
      11
    ),

    new THREE.Vector3(
      0,
      2,
      0
    )

  );

}


/* =====================================================
   NEXT CHAPTER
===================================================== */

function nextChapter() {

  if (
    currentScene !==
    "golghar"
  ) {
    return;
  }


  title.textContent =
    "And now…";


  description.textContent =
    "The real story begins here. ❤️";


  actionButton.textContent =
    "Coming soon ✦";


  interactionHint.textContent =
    "Next: your memories";


  actionButton.disabled =
    true;

}


/* =====================================================
   MAIN ACTION
===================================================== */

actionButton.addEventListener(
  "click",
  () => {

    if (
      travelling
    ) {
      return;
    }


    if (
      currentScene ===
      "space"
    ) {

      enterIndia();

      return;

    }


    if (
      currentScene ===
      "india"
    ) {

      enterPatna();

      return;

    }


    if (
      currentScene ===
      "patna"
    ) {

      enterGolghar();

      return;

    }


    if (
      currentScene ===
      "golghar"
    ) {

      nextChapter();

    }

  }
);


/* =====================================================
   RAYCASTING / TOUCH
===================================================== */

const raycaster =
  new THREE.Raycaster();


const pointer =
  new THREE.Vector2();


renderer.domElement.addEventListener(

  "pointerup",

  (event) => {

    if (
      travelling
    ) {
      return;
    }


    const rect =
      renderer.domElement
        .getBoundingClientRect();


    pointer.x =
      (
        (
          event.clientX -
          rect.left
        ) /
        rect.width
      ) *
      2 -
      1;


    pointer.y =
      -(
        (
          event.clientY -
          rect.top
        ) /
        rect.height
      ) *
      2 +
      1;


    raycaster.setFromCamera(
      pointer,
      camera
    );


    if (
      currentScene ===
      "space"
    ) {

      const hits =
        raycaster.intersectObjects(
          planets,
          true
        );


      const clickedHer =
        hits.some(
          (hit) => {

            let object =
              hit.object;


            while (
              object
            ) {

              if (
                object.userData
                  ?.her
              ) {
                return true;
              }


              object =
                object.parent;

            }


            return false;

          }
        );


      if (
        clickedHer
      ) {

        enterIndia();

      }

    }


    else if (
      currentScene ===
      "india"
    ) {

      const hits =
        raycaster.intersectObject(
          patna,
          true
        );


      if (
        hits.length
      ) {

        enterPatna();

      }

    }


    else if (
      currentScene ===
      "patna"
    ) {

      const hits =
        raycaster.intersectObject(
          golghar,
          true
        );


      if (
        hits.length
      ) {

        enterGolghar();

      }

    }

  }

);


/* =====================================================
   BACK
===================================================== */

backButton.addEventListener(
  "click",
  () => {

    currentScene =
      "space";


    solarSystem.visible =
      true;


    india.visible =
      false;


    city.visible =
      false;


    camera.position.set(
      0,
      14,
      46
    );


    controls.target.set(
      0,
      0,
      0
    );


    controls.minDistance =
      4;


    controls.maxDistance =
      100;


    updateUI({

      chapterText:
        "01 · THE UNIVERSE",

      eyebrowText:
        "CHAPTER ONE",

      titleText:
        "Somewhere in the universe…",

      descriptionText:
        "Two people can be far apart and still belong to the same little universe.",

      buttonText:
        "Begin the journey ✦",

      hintText:
        "Drag · pinch · scroll · tap HER"

    });


    backButton.style.display =
      "none";


    actionButton.disabled =
      false;

  }
);


/* =====================================================
   RESIZE
===================================================== */

window.addEventListener(
  "resize",
  () => {

    camera.aspect =
      window.innerWidth /
      window.innerHeight;


    camera.updateProjectionMatrix();


    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );


    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        1.7
      )
    );

  }
);


/* =====================================================
   ANIMATION
===================================================== */

const clock =
  new THREE.Clock();


function animate() {

  requestAnimationFrame(
    animate
  );


  const time =
    clock.getElapsedTime();


  /* Solar system */

  solarSystem.rotation.y =
    time * 0.025;


  /* Planets */

  planets.forEach(
    (planet) => {

      const radius =
        planet.userData
          .distance;


      const speed =
        planet.userData
          .speed;


      const angle =
        planet.userData
          .angle;


      planet.position.x =
        Math.cos(
          time * speed +
          angle
        ) *
        radius;


      planet.position.z =
        Math.sin(
          time * speed +
          angle
        ) *
        radius;

    }
  );


  /* ME */

  const her =
    planets.find(
      (planet) =>
        planet.userData.her
    );


  if (her) {

    const me =
      her.children.find(
        (child) =>
          child.userData?.me
      );


    if (me) {

      const radius =
        2.5;


      const angle =
        time * 1.2;


      me.position.x =
        Math.cos(angle) *
        radius;


      me.position.z =
        Math.sin(angle) *
        radius;

    }

  }


  /* Stars */

  stars.rotation.y =
    time * 0.002;


  /* Golghar animation */

  if (
    currentScene ===
    "patna"
  ) {

    golghar.rotation.y =
      Math.sin(time * 0.3) *
      0.08;

  }


  controls.update();


  renderer.render(
    scene,
    camera
  );

}


animate();
