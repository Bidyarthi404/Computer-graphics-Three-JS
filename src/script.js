import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const particleTexture = textureLoader.load('textures/particles/4.png');

const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');

const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg');
const bricksAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg');
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg');
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg');

const grassColorTexture = textureLoader.load('/textures/grass/color.jpg');
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg');
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg');
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg');

grassColorTexture.repeat.set(8, 8);
grassAmbientOcclusionTexture.repeat.set(8, 8);
grassNormalTexture.repeat.set(8, 8);
grassRoughnessTexture.repeat.set(8, 8);

grassColorTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

grassColorTexture.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

const stonePathColorTexture = textureLoader.load('/textures/stonePath/color.jpg');
const stonePathAmbientOcclusionTexture = textureLoader.load('/textures/stonePath/ambientOcclusion.jpg');
const stonePathNormalTexture = textureLoader.load('/textures/stonePath/normal.jpg');
const stonePathRoughnessTexture = textureLoader.load('/textures/stonePath/roughness.jpg');
const stonePathHeightTexture = textureLoader.load('/textures/stonePath/height.png');

// Load nameplate textures
const nameplate1Texture = textureLoader.load('/textures/ani.jpg');
const nameplate2Texture = textureLoader.load('/textures/paul.jpg');

// Load window texture
const windowTexture = textureLoader.load('/textures/door.png');

stonePathColorTexture.repeat.set(1, 16);
stonePathAmbientOcclusionTexture.repeat.set(1, 16);
stonePathNormalTexture.repeat.set(1, 16);
stonePathRoughnessTexture.repeat.set(1, 16);

stonePathColorTexture.wrapS = THREE.RepeatWrapping;
stonePathAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
stonePathNormalTexture.wrapS = THREE.RepeatWrapping;
stonePathRoughnessTexture.wrapS = THREE.RepeatWrapping;

stonePathColorTexture.wrapT = THREE.RepeatWrapping;
stonePathAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
stonePathNormalTexture.wrapT = THREE.RepeatWrapping;
stonePathRoughnessTexture.wrapT = THREE.RepeatWrapping;

/**
 * Shaders
 */
const vertexShader = `
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform sampler2D uTexture;
varying vec2 vUv;

void main() {
    vec4 color = texture2D(uTexture, vUv);
    gl_FragColor = vec4(color.rgb, color.a);
}
`;

/**
 * Houses
 */

// Group for houses
const houses = new THREE.Group();
scene.add(houses);

// Original House (Building with floors)
const building = new THREE.Group();
building.position.x = -4;
houses.add(building);

// Create floors for the building
const floorCount = 2;
const floorHeight = 2.5;
const wallDepth = 4;

for (let i = 0; i < floorCount; i++) {
    // Walls for each floor
    const walls = new THREE.Mesh(
        new THREE.BoxGeometry(4, floorHeight, wallDepth),
        new THREE.MeshStandardMaterial({
            map: bricksColorTexture,
            aoMap: bricksAmbientOcclusionTexture,
            normalMap: bricksNormalTexture,
            roughnessMap: bricksRoughnessTexture
        })
    );
    walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2));
    walls.position.y = floorHeight / 2 + i * floorHeight;
    building.add(walls);

    // Divider between floors
    if (i < floorCount - 1) {
        const divider = new THREE.Mesh(
            new THREE.BoxGeometry(4.2, 0.2, wallDepth + 0.2), // Slightly increase dimensions
            new THREE.MeshStandardMaterial({
                color: '#404040' // Darker gray color for the divider
            })
        );
        divider.position.y = (i + 1) * floorHeight - 0.1;
        divider.position.x = 0; // Centered position
        building.add(divider);
    }

    // Windows for each floor
    const windowMaterial = new THREE.MeshBasicMaterial({ map: windowTexture });
    const windowGeometry = new THREE.PlaneGeometry(1, 1);

    // Front and back windows
    if (i > 0) { // Skip bottom floor for front windows
        for (let j = 0; j < 2; j++) {
            const frontWindow = new THREE.Mesh(windowGeometry, windowMaterial);
            frontWindow.position.set(-1 + j * 2, floorHeight / 2 + i * floorHeight, wallDepth / 2 + 0.02); // Adjusted positions
            building.add(frontWindow);
        }
    }

    // Back windows (keep for all floors)
    for (let j = 0; j < 2; j++) {
        const backWindow = new THREE.Mesh(windowGeometry, windowMaterial);
        backWindow.position.set(-1 + j * 2, floorHeight / 2 + i * floorHeight, -wallDepth / 2 - 0.02); // Adjusted positions
        backWindow.rotation.y = Math.PI;
        building.add(backWindow);
    }

    // Side windows
    for (let k = 0; k < 2; k++) {
        const sideWindow = new THREE.Mesh(windowGeometry, windowMaterial);
        sideWindow.position.set(wallDepth / 2 + 0.02, floorHeight / 2 + i * floorHeight, -1 + k * 2); // Adjusted positions
        sideWindow.rotation.y = Math.PI / 2;
        building.add(sideWindow);

        const oppositeSideWindow = new THREE.Mesh(windowGeometry, windowMaterial);
        oppositeSideWindow.position.set(-wallDepth / 2 - 0.02, floorHeight / 2 + i * floorHeight, -1 + k * 2); // Adjusted positions
        oppositeSideWindow.rotation.y = -Math.PI / 2;
        building.add(oppositeSideWindow);
    }
}

// Flat Roof
const roof = new THREE.Mesh(
    new THREE.PlaneGeometry(4, wallDepth),
    new THREE.MeshStandardMaterial({ color: '#b35f45' })
);
roof.rotation.x = -Math.PI / 2;
roof.position.y = floorCount * floorHeight;
building.add(roof);

// Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture
    })
);
door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2));
door.position.y = 1;
door.position.z = wallDepth / 2 + 0.01;
building.add(door);

// Nameplate for the door
const nameplate1 = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 0.5),
    new THREE.MeshBasicMaterial({ map: nameplate1Texture })
);
nameplate1.position.set(1.3, 1.5, wallDepth / 2 + 0.02);
building.add(nameplate1);

// Stone Path for the Building
const stonePathBuilding = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 8, 100, 100),
    new THREE.MeshStandardMaterial({
        map: stonePathColorTexture,
        aoMap: stonePathAmbientOcclusionTexture,
        displacementMap: stonePathHeightTexture,
        displacementScale: 0.05,
        normalMap: stonePathNormalTexture,
        roughnessMap: stonePathRoughnessTexture
    })
);
stonePathBuilding.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(stonePathBuilding.geometry.attributes.uv.array, 2));
stonePathBuilding.rotation.x = -Math.PI * 0.5;
stonePathBuilding.position.set(-4, 0.01, 4);
scene.add(stonePathBuilding);

// New House (Cottage) to the right
const cottage = new THREE.Group();
cottage.position.x = 4;
houses.add(cottage);

// Cottage Walls
const cottageWalls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        map: bricksColorTexture,
        aoMap: bricksAmbientOcclusionTexture,
        normalMap: bricksNormalTexture,
        roughnessMap: bricksRoughnessTexture
    })
);
cottageWalls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(cottageWalls.geometry.attributes.uv.array, 2));
cottageWalls.position.y = 2.5 / 2;
cottage.add(cottageWalls);

// Cottage Roof
const cottageRoof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({ color: '#b35f45' })
);
cottageRoof.position.y = 2.5 + 0.5;
cottageRoof.rotation.y = Math.PI / 4;
cottage.add(cottageRoof);

// Cottage Door (only on the front)
const cottageDoor = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture
    })
);
cottageDoor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(cottageDoor.geometry.attributes.uv.array, 2));
cottageDoor.position.y = 1;
cottageDoor.position.z = 2 + 0.01;
cottage.add(cottageDoor);

// Nameplate for the cottage door
const nameplate2 = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 0.5),
    new THREE.MeshBasicMaterial({ map: nameplate2Texture })
);
nameplate2.position.set(1.3, 1.5, 2.02);
cottage.add(nameplate2);

// Cottage Windows (on the left, right, and back sides)
const customShaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
        uTexture: { value: windowTexture }
    },
    vertexShader,
    fragmentShader
});

const windowGeometry = new THREE.PlaneGeometry(1, 1);

// Left Side Windows
for (let i = 0; i < 2; i++) {
    const leftWindow = new THREE.Mesh(windowGeometry, customShaderMaterial);
    leftWindow.position.set(-2.1, 1.5, 1 - i * 2);
    leftWindow.rotation.y = -Math.PI / 2;
    cottage.add(leftWindow);
}

// Right Side Windows
for (let i = 0; i < 2; i++) {
    const rightWindow = new THREE.Mesh(windowGeometry, customShaderMaterial);
    rightWindow.position.set(2.1, 1.5, 1 - i * 2);
    rightWindow.rotation.y = Math.PI / 2;
    cottage.add(rightWindow);
}

// Back Windows
for (let i = 0; i < 2; i++) {
    const backWindow = new THREE.Mesh(windowGeometry, customShaderMaterial);
    backWindow.position.set(1 - i * 2, 1.5, -2 - 0.02);
    backWindow.rotation.y = Math.PI;
    cottage.add(backWindow);
}

// Stone Path for the Cottage
const stonePathCottage = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 8, 100, 100),
    new THREE.MeshStandardMaterial({
        map: stonePathColorTexture,
        aoMap: stonePathAmbientOcclusionTexture,
        displacementMap: stonePathHeightTexture,
        displacementScale: 0.05,
        normalMap: stonePathNormalTexture,
        roughnessMap: stonePathRoughnessTexture
    })
);
stonePathCottage.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(stonePathCottage.geometry.attributes.uv.array, 2));
stonePathCottage.rotation.x = -Math.PI * 0.5;
stonePathCottage.position.set(4, 0.01, 4);
scene.add(stonePathCottage);

/**
 * Lighting
 */
const ambientLight = new THREE.AmbientLight('#b8d5ff', 0.08); // Increased ambient light intensity
scene.add(ambientLight);

const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.2); // Increased directional light intensity
moonLight.position.set(4, 5, -2);
scene.add(moonLight);

// Create a sphere to represent the moon
const moonGeometry = new THREE.SphereGeometry(1, 32, 32);
const moonMaterial = new THREE.MeshBasicMaterial({ color: '#b9d5ff' });
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.set(5, 8, -2);
scene.add(moon);

// Steady lights at the four corners around the original house
const houseCornerLights = [];
const houseLightPositions = [
    [-2.5, 0.5, 2.5],
    [-2.5, 0.5, -2.5],
    [2.5, 0.5, 2.5],
    [2.5, 0.5, -2.5]
];

for (const pos of houseLightPositions) {
    const light = new THREE.PointLight('#ff7d46', 2, 5);
    light.position.set(...pos);
    building.add(light);
    houseCornerLights.push(light);
}

// Steady lights at the four corners around the cottage
const cottageCornerLights = [];
const cottageLightPositions = [
    [-2.5, 0.5, 2.5],
    [-2.5, 0.5, -2.5],
    [2.5, 0.5, 2.5],
    [2.5, 0.5, -2.5]
];

for (const pos of cottageLightPositions) {
    const light = new THREE.PointLight('#ff7d46', 2, 5);
    light.position.set(...pos);
    cottage.add(light);
    cottageCornerLights.push(light);
}

// Adding bushes along the sides of the paths
const bushGeometry = new THREE.SphereGeometry(0.5, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' });

function addBushesAlongPath(path, count) {
    for (let i = 0; i < count; i++) {
        const offset = i * 2 + 1;
        const bushLeft = new THREE.Mesh(bushGeometry, bushMaterial);
        bushLeft.position.set(path.position.x - 1.5, 0.25, path.position.z - 4 + offset);
        const bushRight = new THREE.Mesh(bushGeometry, bushMaterial);
        bushRight.position.set(path.position.x + 1.5, 0.25, path.position.z - 4 + offset);
        scene.add(bushLeft);
        scene.add(bushRight);
    }
}

addBushesAlongPath(stonePathBuilding, 4);
addBushesAlongPath(stonePathCottage, 4);

// Adding trees around both houses
const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.3, 2, 12);
const trunkMaterial = new THREE.MeshStandardMaterial({ color: '#8b5a2b' });

const foliageGeometry = new THREE.ConeGeometry(1.5, 3, 12);
const foliageMaterial = new THREE.MeshStandardMaterial({ color: '#228b22' });

function addTree(x, z) {
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.set(x, 1, z);

    const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
    foliage.position.set(x, 3, z);

    scene.add(trunk);
    scene.add(foliage);
}

// Add trees around the original house
const houseTreePositions = [
    [-4, 5],
    [-4, -5],
    [-4, 0],
    [4, -3],
    [0, -6]
];
houseTreePositions.forEach(pos => addTree(building.position.x + pos[0], building.position.z + pos[1]));

// Add trees around the cottage
const cottageTreePositions = [
    [4, 5],
    [4, -5],
    [4, 0],
    [0, -6]
];
cottageTreePositions.forEach(pos => addTree(cottage.position.x + pos[0], cottage.position.z + pos[1]));

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(6, 3, 10);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor('#262837');
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

moonLight.castShadow = true;
houseCornerLights.forEach(light => light.castShadow = true);
cottageCornerLights.forEach(light => light.castShadow = true);

building.children.forEach(child => {
    if (child instanceof THREE.Mesh) {
        child.castShadow = true;
    }
});
cottageWalls.castShadow = true;

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture
    })
);
floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2));
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

floor.receiveShadow = true;

/**
 * Particles
 */
const particlesGeometry = new THREE.BufferGeometry();
const count = 100;

const positions = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 17;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.09,
    sizeAttenuation: true,
    transparent: true,
    alphaMap: particleTexture,
    depthWrite: false,
    blending: THREE.AdditiveBlending
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

/**
 * Ghosts
 */
// const ghost1 = new THREE.PointLight('#ff00ff', 2, 3);
// scene.add(ghost1);

// const ghost2 = new THREE.PointLight('#00ffff', 2, 3);
// scene.add(ghost2);

// const ghost3 = new THREE.PointLight('#ffff00', 2, 3);
// scene.add(ghost3);
const rotatingLight = new THREE.PointLight('#ffffff', 1, 10);
rotatingLight.position.set(0, 2.5, 5);
scene.add(rotatingLight);

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update particles
    particles.rotation.y = elapsedTime * 0.02;

    // Rotate light around the original house
    const radius = 5;
    rotatingLight.position.x = building.position.x + radius * Math.cos(elapsedTime);
    rotatingLight.position.z = building.position.z + radius * Math.sin(elapsedTime);
    rotatingLight.position.y = 1; // Adjust height as needed

    // // Update Ghosts
    // const ghost1Angle = elapsedTime * 0.5;
    // ghost1.position.x = Math.cos(ghost1Angle) * 4;
    // ghost1.position.z = Math.sin(ghost1Angle) * 4;
    // ghost1.position.y = Math.sin(elapsedTime * 3);

    // const ghost2Angle = -elapsedTime * 0.32;
    // ghost2.position.x = Math.cos(ghost2Angle) * 5;
    // ghost2.position.z = Math.sin(ghost2Angle) * 5;
    // ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

    // const ghost3Angle = -elapsedTime * 0.18;
    // ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
    // ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
    // ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();

/**
 * Keyboard Controls
 */
// Constants for rotation speed
const rotateAngle = 0.05;

// Event listener for keydown
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            camera.position.y += 0.5;
            break;
        case 'ArrowDown':
            camera.position.y -= 0.5;
            break;
        case 'ArrowLeft':
            camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), -rotateAngle);
            break;
        case 'ArrowRight':
            camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotateAngle);
            break;
    }
});

/**
 * Mouse Interaction for Changing Texture
 */
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([cottageWalls]);

    if (intersects.length > 0) {
        const material = intersects[0].object.material;
        material.color.setHex(Math.random() * 0xffffff);
    }
});
