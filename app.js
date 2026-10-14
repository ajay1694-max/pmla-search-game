// ==========================================================================
// OPERATION PANCHNAMA: 3D WEBGL ENGINE, PROCEDURAL PBR ROOM & GAME CONTROLLER
// ==========================================================================

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { CASE_METADATA, CAMERA_ZONES, EVIDENCE_ITEMS, SUSPECT_CONFRONTATION_QUESTIONS } from './case_data.js';

// --------------------------------------------------------------------------
// 1. SYNTHESIZED TACTICAL AUDIO ENGINE (Web Audio API - Zero External Assets)
// --------------------------------------------------------------------------
class TacticalAudio {
    constructor() {
        this.ctx = null;
    }
    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }
    playTone(freq = 600, duration = 0.08, type = 'sine', gainVal = 0.08) {
        try {
            this.init();
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (_) {}
    }
    playClick() { this.playTone(880, 0.05, 'triangle', 0.07); }
    playScan() {
        this.playTone(520, 0.12, 'sine', 0.08);
        setTimeout(() => this.playTone(1040, 0.18, 'sine', 0.07), 90);
    }
    playSuccess() {
        this.playTone(587.33, 0.1, 'triangle', 0.1);
        setTimeout(() => this.playTone(880, 0.22, 'triangle', 0.12), 100);
    }
    playError() {
        this.playTone(220, 0.18, 'sawtooth', 0.09);
        setTimeout(() => this.playTone(165, 0.28, 'sawtooth', 0.09), 140);
    }
}

const sfx = new TacticalAudio();

// --------------------------------------------------------------------------
// 2. PROCEDURAL TEXTURE GENERATORS (Marble, Wood, Painting, Laptop Screen)
// --------------------------------------------------------------------------
function createMarbleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#181e29';
    ctx.fillRect(0, 0, 512, 512);

    // Subtle tile grid & gold/grey veins
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 2;
    for (let i = 0; i <= 512; i += 128) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 512); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(512, i); ctx.stroke();
    }
    for (let v = 0; v < 18; v++) {
        ctx.strokeStyle = v % 3 === 0 ? 'rgba(212, 175, 55, 0.07)' : 'rgba(148, 163, 184, 0.06)';
        ctx.lineWidth = 1 + Math.random() * 2;
        ctx.beginPath();
        let x = Math.random() * 512;
        let y = Math.random() * 512;
        ctx.moveTo(x, y);
        for (let s = 0; s < 5; s++) {
            x += (Math.random() - 0.5) * 120;
            y += (Math.random() - 0.5) * 120;
            ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 4);
    return tex;
}

function createWoodTexture(baseHex = '#3a2012', grainHex = '#231107') {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, 512, 512);
    ctx.fillStyle = grainHex;
    for (let i = 0; i < 300; i++) {
        const y = Math.random() * 512;
        const h = 1 + Math.random() * 3;
        ctx.globalAlpha = 0.12 + Math.random() * 0.2;
        ctx.fillRect(0, y, 512, h);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
}

function createLaptopScreenTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 320;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#07131f';
    ctx.fillRect(0, 0, 512, 320);

    // Top bar
    ctx.fillStyle = '#0f2942';
    ctx.fillRect(0, 0, 512, 28);
    ctx.fillStyle = '#00e5ff';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('TALLY PRIME // BLACK_LEDGER.hc  |  TELEGRAM: HAWALA DESK', 14, 19);

    // Left Window: Tally Ledger
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.strokeRect(14, 42, 260, 250);
    ctx.fillStyle = '#f5d15b';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('SHELL CO. TRIAL BALANCE', 26, 65);
    ctx.fillStyle = '#a7f3d0';
    ctx.font = '12px monospace';
    const lines = [
        'Mahadev Mineral:  Cr 142.50 Cr',
        'GeetaNagar Trad:  Cr  92.00 Cr',
        'Dubai Gold Corp:  Cr 112.00 Cr',
        'VDA USDT Pool:    Cr 125.50 Cr',
        'Mauritius GBC-1:  Cr  58.00 Cr',
        '-----------------------------',
        'TOTAL POC POOL:   Rs 540.00 Cr'
    ];
    lines.forEach((l, idx) => ctx.fillText(l, 26, 95 + idx * 26));

    // Right Window: Disappearing Chat
    ctx.strokeStyle = '#ff334b';
    ctx.strokeRect(288, 42, 210, 250);
    ctx.fillStyle = '#ff334b';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('AUTO-DELETE TIMER: 04:12', 300, 65);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '11px monospace';
    ctx.fillText('Bhaijaan (Dubai):', 300, 95);
    ctx.fillText('"ED team near VIP Road!"', 300, 115);
    ctx.fillText('"Sweep Ledger USDT now', 300, 140);
    ctx.fillText('and burn the slips!"', 300, 160);

    return new THREE.CanvasTexture(canvas);
}

function createPaintingTexture(uvActive = false) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 384;
    const ctx = canvas.getContext('2d');

    // Rich abstract Bastar bronze/crimson art
    const grad = ctx.createLinearGradient(0, 0, 512, 384);
    grad.addColorStop(0, '#1e1b2e');
    grad.addColorStop(0.5, '#3b1d2e');
    grad.addColorStop(1, '#142030');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 384);

    // Geometric motifs
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 3;
    ctx.strokeRect(24, 24, 464, 336);

    ctx.beginPath();
    ctx.arc(256, 192, 95, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(212, 175, 55, 0.25)';
    ctx.beginPath();
    ctx.arc(256, 192, 55, 0, Math.PI * 2);
    ctx.fill();

    if (uvActive) {
        // Glowing UV forensic handprints & "HINGE RELEASE ->"
        ctx.fillStyle = '#00ffaa';
        ctx.font = 'bold 20px monospace';
        ctx.fillText('[UV TRACE: LATENT PRINTS ON RIGHT EDGE]', 35, 345);
        for (let i = 0; i < 6; i++) {
            ctx.beginPath();
            ctx.arc(470, 90 + i * 35, 14, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    return new THREE.CanvasTexture(canvas);
}

// --------------------------------------------------------------------------
// 3. GAME STATE & CONTROLLER
// --------------------------------------------------------------------------
const gameState = {
    started: false,
    uvMode: false,
    pulseActive: false,
    legalityScore: 100,
    pocSecuredCr: 0,
    sec50Completed: false,
    resolvedItems: {}, // id -> { decisionId, isOptimal, pocSecuredCr, legalityDelta }
    discoveredConcealed: {
        ev_painting: false,
        ev_crypto: false
    }
};

// --------------------------------------------------------------------------
// 4. THREE.JS SCENE SETUP (PBR Materials, Shadows, Post-Processing Bloom)
// --------------------------------------------------------------------------
const canvas = document.getElementById('webgl-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x060a12);
scene.fog = new THREE.FogExp2(0x060a12, 0.035);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(CAMERA_ZONES.overview.pos.x, CAMERA_ZONES.overview.pos.y, CAMERA_ZONES.overview.pos.z);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(CAMERA_ZONES.overview.target.x, CAMERA_ZONES.overview.target.y, CAMERA_ZONES.overview.target.z);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.maxPolarAngle = Math.PI / 2 - 0.03; // Prevent going below floor
controls.minDistance = 1.2;
controls.maxDistance = 11.5;

// Post-processing Composer
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.42, // strength
    0.35, // radius
    0.82  // threshold
);
composer.addPass(bloomPass);

// --------------------------------------------------------------------------
// 5. LIGHTING ARCHITECTURE (Warm Chandelier, Desk Lamp, Window Moonlight, UV)
// --------------------------------------------------------------------------
const ambientLight = new THREE.AmbientLight(0x8fa8c8, 0.55);
scene.add(ambientLight);

// Main Chandelier PointLight
const chandelierLight = new THREE.PointLight(0xffdfa8, 2.4, 18, 1.4);
chandelierLight.position.set(0, 4.9, -0.5);
chandelierLight.castShadow = true;
chandelierLight.shadow.mapSize.set(1024, 1024);
chandelierLight.shadow.bias = -0.001;
scene.add(chandelierLight);

// Executive Desk Banker's Lamp SpotLight
const deskSpot = new THREE.SpotLight(0xffe4a0, 3.8, 10, Math.PI / 3.2, 0.45, 1.2);
deskSpot.position.set(-0.9, 1.85, -2.9);
deskSpot.target.position.set(0, 0.8, -3.1);
deskSpot.castShadow = true;
scene.add(deskSpot);
scene.add(deskSpot.target);

// North Wall Picture Accent Light
const artSpot = new THREE.SpotLight(0xfff0cc, 2.6, 8, Math.PI / 4, 0.5, 1);
artSpot.position.set(3.1, 4.3, -4.0);
artSpot.target.position.set(3.1, 2.3, -5.8);
scene.add(artSpot);
scene.add(artSpot.target);

// UV Forensic Flashlight (attached to camera)
const uvSpotLight = new THREE.SpotLight(0x7c3aed, 0, 12, Math.PI / 5, 0.35, 1.0);
camera.add(uvSpotLight);
uvSpotLight.position.set(0, 0, 0);
const uvTarget = new THREE.Object3D();
uvTarget.position.set(0, 0, -5);
camera.add(uvTarget);
uvSpotLight.target = uvTarget;
scene.add(camera);

// --------------------------------------------------------------------------
// 6. BUILD REALISTIC 3D VILLA STUDY ROOM & INTERACTIVE EVIDENCE PROPS
// --------------------------------------------------------------------------
const interactableObjects = []; // Meshes that raycaster can hit
const evidenceGroups = {};      // Map evidence ID -> THREE.Group
const beaconRings = [];         // Animated marker rings

const marbleTex = createMarbleTexture();
const darkWoodTex = createWoodTexture('#3b2010', '#1f0f06');
const walnutTex = createWoodTexture('#52301c', '#2c170b');
const laptopScreenTex = createLaptopScreenTexture();
const paintingNormalTex = createPaintingTexture(false);
const paintingUVTex = createPaintingTexture(true);

// Shared Materials
const floorMat = new THREE.MeshStandardMaterial({
    map: marbleTex,
    roughness: 0.18,
    metalness: 0.15
});
const wallMat = new THREE.MeshStandardMaterial({
    color: 0x151c28,
    roughness: 0.72,
    metalness: 0.05
});
const wainscotMat = new THREE.MeshStandardMaterial({
    map: darkWoodTex,
    roughness: 0.4,
    metalness: 0.1
});
const walnutMat = new THREE.MeshStandardMaterial({
    map: walnutTex,
    roughness: 0.3,
    metalness: 0.12
});
const brassMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.22,
    metalness: 0.88
});
const steelMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.28,
    metalness: 0.85
});

function buildStudyRoom() {
    const roomGroup = new THREE.Group();

    // 1. Marble Floor (12m x 12m)
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    roomGroup.add(floor);

    // Persian Rug under Executive Desk
    const rugMat = new THREE.MeshStandardMaterial({ color: 0x4a1525, roughness: 0.88 });
    const rug = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.02, 3.8), rugMat);
    rug.position.set(0, 0.01, -2.8);
    rug.receiveShadow = true;
    roomGroup.add(rug);

    const rugBorder = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.015, 4.0), brassMat);
    rugBorder.position.set(0, 0.008, -2.8);
    roomGroup.add(rugBorder);

    // 2. Walls (North, West, East) + Wood Wainscoting
    const northWall = new THREE.Mesh(new THREE.BoxGeometry(12, 5.5, 0.3), wallMat);
    northWall.position.set(0, 2.75, -6);
    northWall.receiveShadow = true;
    roomGroup.add(northWall);

    const westWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 5.5, 12), wallMat);
    westWall.position.set(-6, 2.75, 0);
    westWall.receiveShadow = true;
    roomGroup.add(westWall);

    const eastWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 5.5, 12), wallMat);
    eastWall.position.set(6, 2.75, 0);
    eastWall.receiveShadow = true;
    roomGroup.add(eastWall);

    // Lower Wood Wainscoting Panels
    const northWainscot = new THREE.Mesh(new THREE.BoxGeometry(11.8, 1.5, 0.08), wainscotMat);
    northWainscot.position.set(0, 0.75, -5.82);
    roomGroup.add(northWainscot);

    // Gold Crown Moulding
    const northTrim = new THREE.Mesh(new THREE.BoxGeometry(11.8, 0.06, 0.1), brassMat);
    northTrim.position.set(0, 1.52, -5.81);
    roomGroup.add(northTrim);

    // 3. Ceiling Chandelier Fixture
    const chandStem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8), brassMat);
    chandStem.position.set(0, 5.2, -0.5);
    roomGroup.add(chandStem);
    const chandRing = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.04, 16, 32), new THREE.MeshStandardMaterial({
        color: 0xffecb3, emissive: 0xffb300, emissiveIntensity: 1.5
    }));
    chandRing.rotation.x = Math.PI / 2;
    chandRing.position.set(0, 4.85, -0.5);
    roomGroup.add(chandRing);

    // 4. Center Mahogany Executive Desk (Zone: desk)
    const deskGroup = new THREE.Group();
    deskGroup.position.set(0, 0, -3.0);

    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.1, 1.55), walnutMat);
    deskTop.position.set(0, 0.95, 0);
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    deskGroup.add(deskTop);

    const leftPedestal = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.9, 1.4), wainscotMat);
    leftPedestal.position.set(-1.1, 0.45, 0);
    leftPedestal.castShadow = true;
    deskGroup.add(leftPedestal);

    const rightPedestal = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.9, 1.4), wainscotMat);
    rightPedestal.position.set(1.1, 0.45, 0);
    rightPedestal.castShadow = true;
    deskGroup.add(rightPedestal);

    const modestyPanel = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.75, 0.08), wainscotMat);
    modestyPanel.position.set(0, 0.5, -0.55);
    deskGroup.add(modestyPanel);

    // Banker's Desk Lamp (Visual Prop)
    const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.05, 20), brassMat);
    lampBase.position.set(-1.1, 1.02, -0.35);
    deskGroup.add(lampBase);
    const lampNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.45, 12), brassMat);
    lampNeck.position.set(-1.1, 1.25, -0.35);
    deskGroup.add(lampNeck);
    const lampShade = new THREE.Mesh(
        new THREE.ConeGeometry(0.24, 0.18, 20, 1, true),
        new THREE.MeshStandardMaterial({ color: 0x059669, emissive: 0x047857, emissiveIntensity: 0.6, roughness: 0.2, side: THREE.DoubleSide })
    );
    lampShade.position.set(-1.05, 1.45, -0.32);
    deskGroup.add(lampShade);

    // Executive Leather Chair behind desk
    const chairSeat = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.1, 0.75), new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.4 }));
    chairSeat.position.set(0, 0.58, -1.15);
    deskGroup.add(chairSeat);
    const chairBack = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.95, 0.12), new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.4 }));
    chairBack.position.set(0, 1.1, -1.48);
    deskGroup.add(chairBack);

    roomGroup.add(deskGroup);

    // 5. North Wall Bookcase (Left of Painting)
    const bookcase = new THREE.Mesh(new THREE.BoxGeometry(3.2, 3.8, 0.55), wainscotMat);
    bookcase.position.set(-2.6, 1.9, -5.55);
    bookcase.castShadow = true;
    roomGroup.add(bookcase);

    // Decorative Books on Shelves
    const bookColors = [0x7f1d1d, 0x1e3a8a, 0x14532d, 0x78350f, 0x312e81];
    for (let row = 0; row < 4; row++) {
        for (let b = 0; b < 10; b++) {
            const book = new THREE.Mesh(
                new THREE.BoxGeometry(0.22, 0.42, 0.32),
                new THREE.MeshStandardMaterial({ color: bookColors[(row + b) % bookColors.length], roughness: 0.6 })
            );
            book.position.set(-3.85 + b * 0.26, 0.75 + row * 0.82, -5.42);
            roomGroup.add(book);
        }
    }

    // 6. West Wall Credenza Sideboard (Zone: lounge)
    const credenza = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.0, 3.8), walnutMat);
    credenza.position.set(-5.35, 0.5, -1.2);
    credenza.castShadow = true;
    credenza.receiveShadow = true;
    roomGroup.add(credenza);

    // 7. East Wall Server & Shredder Alcove Table (Zone: server)
    const serverRack = new THREE.Mesh(new THREE.BoxGeometry(0.9, 2.2, 1.1), new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.7, roughness: 0.3 }));
    serverRack.position.set(5.3, 1.1, -2.2);
    roomGroup.add(serverRack);

    // Blinking Server LEDs
    for (let s = 0; s < 5; s++) {
        const led = new THREE.Mesh(
            new THREE.BoxGeometry(0.03, 0.04, 0.65),
            new THREE.MeshStandardMaterial({ color: 0x00e5ff, emissive: 0x00e5ff, emissiveIntensity: 1.8 })
        );
        led.position.set(4.84, 0.6 + s * 0.32, -2.2);
        roomGroup.add(led);
    }

    const sideTable = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.85, 2.2), walnutMat);
    sideTable.position.set(5.25, 0.425, 0.2);
    sideTable.castShadow = true;
    roomGroup.add(sideTable);

    scene.add(roomGroup);
}

// Helper to create a glowing tactical beacon ring on evidence items
function createBeaconRing(colorHex = 0xd4af37) {
    const ringGeo = new THREE.RingGeometry(0.18, 0.24, 32);
    const ringMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    beaconRings.push(ring);
    return ring;
}

// Register an interactive evidence group so any child mesh click maps to `evidenceId`
function registerEvidenceGroup(evidenceId, group) {
    group.userData.evidenceId = evidenceId;
    evidenceGroups[evidenceId] = group;
    group.traverse((child) => {
        if (child.isMesh) {
            child.userData.evidenceId = evidenceId;
            interactableObjects.push(child);
        }
    });
    scene.add(group);
}

function buildEvidenceProps() {
    // ------------------------------------------------------------------
    // RUD-01: Unlocked MacBook Pro M3 Max on Center Desk (ev_laptop)
    // ------------------------------------------------------------------
    const laptopGroup = new THREE.Group();
    laptopGroup.position.set(-0.15, 1.01, -2.85);

    const base = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.025, 0.38), steelMat);
    base.castShadow = true;
    laptopGroup.add(base);

    const screenPivot = new THREE.Group();
    screenPivot.position.set(0, 0.015, -0.18);
    screenPivot.rotation.x = -0.22;

    const lid = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.36, 0.018), steelMat);
    lid.position.set(0, 0.18, 0);
    screenPivot.add(lid);

    const display = new THREE.Mesh(
        new THREE.PlaneGeometry(0.52, 0.32),
        new THREE.MeshBasicMaterial({ map: laptopScreenTex })
    );
    display.position.set(0, 0.18, 0.011);
    screenPivot.add(display);
    laptopGroup.add(screenPivot);

    const ring1 = createBeaconRing(0x00e5ff);
    ring1.position.set(0, 0.02, 0.32);
    laptopGroup.add(ring1);

    registerEvidenceGroup('ev_laptop', laptopGroup);

    // ------------------------------------------------------------------
    // RUD-02: Biometric Wall Safe Behind Painting on North Wall (ev_painting)
    // ------------------------------------------------------------------
    const vaultGroup = new THREE.Group();
    vaultGroup.position.set(3.1, 2.35, -5.78);

    // Recessed Wall Safe (behind canvas)
    const safeBox = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.9, 0.18), new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.25 }));
    safeBox.position.set(0, 0, -0.05);
    vaultGroup.add(safeBox);

    // Gold Bullion Bars & Cash inside safe preview
    const goldBar = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.12, 0.12), brassMat);
    goldBar.position.set(-0.2, -0.15, 0.05);
    vaultGroup.add(goldBar);

    // Hinged Painting Frame
    const framePivot = new THREE.Group();
    framePivot.position.set(-0.85, 0, 0.06); // Left hinge pivot
    vaultGroup.userData.framePivot = framePivot;

    const frameMesh = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.3, 0.06), brassMat);
    frameMesh.position.set(0.85, 0, 0);
    frameMesh.castShadow = true;
    framePivot.add(frameMesh);

    const canvasMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(1.56, 1.16),
        new THREE.MeshStandardMaterial({ map: paintingNormalTex, roughness: 0.35 })
    );
    canvasMesh.position.set(0.85, 0, 0.035);
    vaultGroup.userData.canvasMesh = canvasMesh;
    framePivot.add(canvasMesh);

    vaultGroup.add(framePivot);

    const ring2 = createBeaconRing(0xd4af37);
    ring2.rotation.x = 0;
    ring2.position.set(0, -0.82, 0.12);
    vaultGroup.add(ring2);

    registerEvidenceGroup('ev_painting', vaultGroup);

    // ------------------------------------------------------------------
    // RUD-03: Hollowed Law Lexicon & Hawala Diary on West Credenza (ev_ledger)
    // ------------------------------------------------------------------
    const ledgerGroup = new THREE.Group();
    ledgerGroup.position.set(-5.25, 1.02, -0.45);

    const outerBook = new THREE.Mesh(
        new THREE.BoxGeometry(0.46, 0.11, 0.58),
        new THREE.MeshStandardMaterial({ color: 0x5c1922, roughness: 0.45 })
    );
    outerBook.castShadow = true;
    ledgerGroup.add(outerBook);

    const goldSpine = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.03, 0.59), brassMat);
    goldSpine.position.set(0, 0.05, 0);
    ledgerGroup.add(goldSpine);

    // Torn Rs 10 Hawala Token Note sticking out
    const tokenNote = new THREE.Mesh(
        new THREE.PlaneGeometry(0.28, 0.14),
        new THREE.MeshStandardMaterial({ color: 0xfde68a, side: THREE.DoubleSide })
    );
    tokenNote.rotation.x = -Math.PI / 2;
    tokenNote.rotation.z = 0.35;
    tokenNote.position.set(0.18, 0.065, 0.12);
    ledgerGroup.add(tokenNote);

    const ring3 = createBeaconRing(0xd4af37);
    ring3.position.set(0.28, 0.01, 0);
    ledgerGroup.add(ring3);

    registerEvidenceGroup('ev_ledger', ledgerGroup);

    // ------------------------------------------------------------------
    // RUD-04: False Drawer Bottom with Ledger Nano X & Seed Plate (ev_crypto)
    // ------------------------------------------------------------------
    const cryptoGroup = new THREE.Group();
    cryptoGroup.position.set(0.95, 0.82, -2.25); // Right desk drawer pulled slightly out

    const drawerBox = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.16, 0.55), walnutMat);
    drawerBox.castShadow = true;
    cryptoGroup.add(drawerBox);

    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.03, 0.04), brassMat);
    handle.position.set(0, 0.02, 0.29);
    cryptoGroup.add(handle);

    // Titanium Seed Plate & USB Hardware Wallet inside
    const seedPlate = new THREE.Mesh(
        new THREE.BoxGeometry(0.26, 0.015, 0.16),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.7, metalness: 0.9, roughness: 0.15 })
    );
    seedPlate.position.set(-0.08, 0.09, 0.05);
    cryptoGroup.add(seedPlate);

    const nanoStick = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.03, 0.05), steelMat);
    nanoStick.position.set(0.14, 0.09, 0.08);
    cryptoGroup.add(nanoStick);

    const ring4 = createBeaconRing(0x00e5ff);
    ring4.position.set(0, 0.11, 0.18);
    cryptoGroup.add(ring4);

    registerEvidenceGroup('ev_crypto', cryptoGroup);

    // ------------------------------------------------------------------
    // RUD-05: 24 Shell Company Stamps & Pre-Signed Cheque Dossier (ev_shells)
    // ------------------------------------------------------------------
    const shellsGroup = new THREE.Group();
    shellsGroup.position.set(-5.25, 1.02, -2.15);

    // Open Samsonite Briefcase
    const caseBase = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, 0.09, 0.72),
        new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.3, metalness: 0.4 })
    );
    caseBase.castShadow = true;
    shellsGroup.add(caseBase);

    // Grid of Blue/Red Rubber Stamps & Yellow Cheque Books
    for (let i = 0; i < 6; i++) {
        const stamp = new THREE.Mesh(
            new THREE.CylinderGeometry(0.035, 0.04, 0.09, 12),
            new THREE.MeshStandardMaterial({ color: i % 2 === 0 ? 0xdc2626 : 0x2563eb })
        );
        stamp.position.set(-0.12 + (i % 2) * 0.12, 0.08, -0.22 + Math.floor(i / 2) * 0.14);
        shellsGroup.add(stamp);
    }

    const chequeStack = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 0.08, 0.42),
        new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.6 })
    );
    chequeStack.position.set(0.12, 0.07, 0.08);
    shellsGroup.add(chequeStack);

    const ring5 = createBeaconRing(0xd4af37);
    ring5.position.set(0.28, 0.01, 0);
    shellsGroup.add(ring5);

    registerEvidenceGroup('ev_shells', shellsGroup);

    // ------------------------------------------------------------------
    // RUD-06: Submerged Burner iPhones & Paper Shredder Bin (ev_burner)
    // ------------------------------------------------------------------
    const burnerGroup = new THREE.Group();
    burnerGroup.position.set(5.15, 0.86, 0.25);

    // Translucent Water Pitcher on East Table
    const pitcher = new THREE.Mesh(
        new THREE.CylinderGeometry(0.16, 0.14, 0.36, 24),
        new THREE.MeshPhysicalMaterial({
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.48,
            roughness: 0.1,
            transmission: 0.6
        })
    );
    pitcher.position.set(0, 0.18, -0.25);
    burnerGroup.add(pitcher);

    // Glowing Submerged iPhone inside pitcher
    const iphone1 = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.18, 0.015),
        new THREE.MeshStandardMaterial({ color: 0x111827, emissive: 0xef4444, emissiveIntensity: 1.4 })
    );
    iphone1.rotation.z = 0.2;
    iphone1.position.set(0, 0.14, -0.25);
    burnerGroup.add(iphone1);

    // Cross-Cut Shredder Bin next to pitcher
    const shredderBin = new THREE.Mesh(
        new THREE.BoxGeometry(0.38, 0.45, 0.34),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.5, roughness: 0.4 })
    );
    shredderBin.position.set(0, 0.22, 0.35);
    burnerGroup.add(shredderBin);

    const ring6 = createBeaconRing(0xff334b);
    ring6.position.set(-0.22, 0.02, 0.05);
    burnerGroup.add(ring6);

    registerEvidenceGroup('ev_burner', burnerGroup);
}

buildStudyRoom();
buildEvidenceProps();

// --------------------------------------------------------------------------
// 7. CAMERA TWEENING & WASD / ORBIT NAVIGATION
// --------------------------------------------------------------------------
let activeTween = null;

function flyToZone(zoneKey) {
    const z = CAMERA_ZONES[zoneKey];
    if (!z) return;
    sfx.playClick();

    // Update active button styling
    document.querySelectorAll('.zone-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.zone === zoneKey);
    });

    const startPos = camera.position.clone();
    const startTarget = controls.target.clone();
    const endPos = new THREE.Vector3(z.pos.x, z.pos.y, z.pos.z);
    const endTarget = new THREE.Vector3(z.target.x, z.target.y, z.target.z);

    activeTween = {
        startTime: performance.now(),
        duration: 850,
        startPos,
        startTarget,
        endPos,
        endTarget
    };

    setToast(`Camera repositioned to: ${z.name}`);
}

const keyState = {};
window.addEventListener('keydown', (e) => {
    keyState[e.code] = true;
    if (!gameState.started) return;

    if (e.code === 'KeyF') toggleUVMode();
    if (e.code === 'KeyH') triggerIntelPulse();
    if (e.key === '1') flyToZone('overview');
    if (e.key === '2') flyToZone('desk');
    if (e.key === '3') flyToZone('vault');
    if (e.key === '4') flyToZone('lounge');
    if (e.key === '5') flyToZone('server');
});
window.addEventListener('keyup', (e) => {
    keyState[e.code] = false;
});

function updateWASDMovement(delta) {
    if (activeTween) return;
    const speed = 3.2 * delta;
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();

    const move = new THREE.Vector3();
    if (keyState['KeyW'] || keyState['ArrowUp']) move.add(forward);
    if (keyState['KeyS'] || keyState['ArrowDown']) move.sub(forward);
    if (keyState['KeyD'] || keyState['ArrowRight']) move.add(right);
    if (keyState['KeyA'] || keyState['ArrowLeft']) move.sub(right);

    if (move.lengthSq() > 0) {
        move.normalize().multiplyScalar(speed);
        camera.position.add(move);
        controls.target.add(move);
        // Clamp inside study room bounds
        camera.position.x = THREE.MathUtils.clamp(camera.position.x, -5.2, 5.2);
        camera.position.z = THREE.MathUtils.clamp(camera.position.z, -5.0, 5.2);
        camera.position.y = THREE.MathUtils.clamp(camera.position.y, 1.0, 5.0);
    }
}

// --------------------------------------------------------------------------
// 8. RAYCASTING, HOVER TOOLTIPS & OBJECT CLICK HANDLING
// --------------------------------------------------------------------------
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let hoveredEvidenceId = null;

const reticleEl = document.getElementById('center-reticle');
const hoverLabelEl = document.getElementById('hover-label');
const hlTitleEl = document.getElementById('hl-title-text');
const hlStatusEl = document.getElementById('hl-status-text');

window.addEventListener('pointermove', (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;

    if (!gameState.started) return;

    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(interactableObjects, false);

    if (hits.length > 0) {
        const evId = hits[0].object.userData.evidenceId;
        const item = EVIDENCE_ITEMS.find(it => it.id === evId);
        if (item) {
            hoveredEvidenceId = evId;
            reticleEl.classList.add('active-target');
            hoverLabelEl.classList.add('visible');
            hoverLabelEl.style.left = `${e.clientX}px`;
            hoverLabelEl.style.top = `${e.clientY}px`;
            hlTitleEl.textContent = `${item.code}: ${item.title}`;
            const resolved = gameState.resolvedItems[evId];
            hlStatusEl.textContent = resolved
                ? (resolved.isOptimal ? `✓ SEIZED & FROZEN (₹${resolved.pocSecuredCr} Cr)` : `⚠ PROCEDURAL DEFECT LOGGED`)
                : `⚡ Click to Inspect (${item.shortHint})`;
            canvas.style.cursor = 'pointer';
            return;
        }
    }

    hoveredEvidenceId = null;
    reticleEl.classList.remove('active-target');
    hoverLabelEl.classList.remove('visible');
    canvas.style.cursor = 'grab';
});

// Distinguish drag vs click
let pointerDownPos = { x: 0, y: 0 };
canvas.addEventListener('pointerdown', (e) => {
    pointerDownPos = { x: e.clientX, y: e.clientY };
});

canvas.addEventListener('pointerup', (e) => {
    if (!gameState.started) return;
    const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
    if (dist < 6 && hoveredEvidenceId) {
        openEvidenceModal(hoveredEvidenceId);
    }
});

// --------------------------------------------------------------------------
// 9. FORENSIC GADGETS: UV LIGHT [F] & INTEL PULSE [H]
// --------------------------------------------------------------------------
function toggleUVMode() {
    gameState.uvMode = !gameState.uvMode;
    sfx.playScan();
    const btn = document.getElementById('btn-uv-light');
    btn.classList.toggle('active', gameState.uvMode);

    if (gameState.uvMode) {
        uvSpotLight.intensity = 7.5;
        chandelierLight.intensity = 0.45;
        ambientLight.color.setHex(0x4c1d95);
        // Swap painting texture to reveal UV latent fingerprints
        const vaultGrp = evidenceGroups['ev_painting'];
        if (vaultGrp && vaultGrp.userData.canvasMesh) {
            vaultGrp.userData.canvasMesh.material.map = paintingUVTex;
            vaultGrp.userData.canvasMesh.material.needsUpdate = true;
        }
        setToast("🔦 UV Latent Trace Beam ACTIVE: Inspect North Wall Painting & Desk Drawer for fluorescent forensic traces!");
    } else {
        uvSpotLight.intensity = 0;
        chandelierLight.intensity = 2.4;
        ambientLight.color.setHex(0x8fa8c8);
        const vaultGrp = evidenceGroups['ev_painting'];
        if (vaultGrp && vaultGrp.userData.canvasMesh) {
            vaultGrp.userData.canvasMesh.material.map = paintingNormalTex;
            vaultGrp.userData.canvasMesh.material.needsUpdate = true;
        }
        setToast("Standard illumination restored.");
    }
}

function triggerIntelPulse() {
    sfx.playScan();
    gameState.pulseActive = true;
    const btn = document.getElementById('btn-scanner-pulse');
    btn.classList.add('active');
    bloomPass.strength = 1.15;
    setToast("📡 PMLA Financial Intelligence Pulse: All 6 RUD Exhibits highlighted in 3D space for 4 seconds!");

    setTimeout(() => {
        gameState.pulseActive = false;
        btn.classList.remove('active');
        bloomPass.strength = 0.42;
    }, 4000);
}

// --------------------------------------------------------------------------
// 10. UI HUD & NATIVE <DIALOG> MODAL CONTROLLERS (with Light-Dismiss Fallback)
// --------------------------------------------------------------------------
function setupDialogLightDismissFallback(dialogEl) {
    if (!('closedBy' in HTMLDialogElement.prototype)) {
        dialogEl.addEventListener('click', (event) => {
            if (event.target !== dialogEl) return;
            const rect = dialogEl.getBoundingClientRect();
            const isDialogContent = (
                rect.top <= event.clientY &&
                event.clientY <= rect.top + rect.height &&
                rect.left <= event.clientX &&
                event.clientX <= rect.left + rect.width
            );
            if (!isDialogContent) dialogEl.close();
        });
    }
}

const evModal = document.getElementById('evidence-modal');
const confrontModal = document.getElementById('confront-modal');
const dossierModal = document.getElementById('dossier-modal');
[evModal, confrontModal, dossierModal].forEach(setupDialogLightDismissFallback);

function setToast(msg) {
    const el = document.getElementById('hud-toast-text');
    if (el) el.textContent = msg;
}

function renderEvidenceSidebar() {
    const listEl = document.getElementById('hud-evidence-list');
    listEl.innerHTML = '';

    EVIDENCE_ITEMS.forEach((item) => {
        const resolved = gameState.resolvedItems[item.id];
        const row = document.createElement('div');
        row.className = 'ev-item';
        if (resolved) {
            row.classList.add(resolved.isOptimal ? 'resolved-valid' : 'resolved-flawed');
        }

        const statusLabel = resolved
            ? (resolved.isOptimal ? `₹${resolved.pocSecuredCr} Cr` : `DEFECT (₹${resolved.pocSecuredCr} Cr)`)
            : `Pending`;

        row.innerHTML = `
            <div class="ev-item-name">
                <span>${resolved ? (resolved.isOptimal ? '✅' : '⚠️') : '🔍'}</span>
                <span><strong>${item.code}:</strong> ${item.title.slice(0, 26)}...</span>
            </div>
            <span class="ev-item-status">${statusLabel}</span>
        `;
        row.addEventListener('click', () => {
            flyToZone(item.zone);
            setTimeout(() => openEvidenceModal(item.id), 450);
        });
        listEl.appendChild(row);
    });

    // Update Topbar Metrics
    const resolvedCount = Object.keys(gameState.resolvedItems).length;
    document.getElementById('hud-exhibits-count').textContent = `${resolvedCount} / ${EVIDENCE_ITEMS.length}`;
    document.getElementById('hud-poc-amount').textContent = `₹${gameState.pocSecuredCr.toFixed(2)} Cr / ₹540 Cr`;

    const legEl = document.getElementById('hud-legality-score');
    legEl.textContent = `${gameState.legalityScore}%`;
    legEl.className = 'metric-value ' + (gameState.legalityScore >= 80 ? 'emerald' : gameState.legalityScore >= 50 ? 'gold' : 'crimson');

    const progTag = document.getElementById('rud-progress-tag');
    progTag.textContent = resolvedCount === EVIDENCE_ITEMS.length ? 'All RUDs Inspected!' : `${resolvedCount}/6 Processed`;
}

function openEvidenceModal(evidenceId) {
    const item = EVIDENCE_ITEMS.find(it => it.id === evidenceId);
    if (!item) return;

    sfx.playClick();
    flyToZone(item.zone);

    // If it's the wall safe painting, swing the canvas open in 3D!
    if (evidenceId === 'ev_painting') {
        const vaultGrp = evidenceGroups['ev_painting'];
        if (vaultGrp && vaultGrp.userData.framePivot) {
            vaultGrp.userData.framePivot.rotation.y = -1.15;
        }
    }

    document.getElementById('ev-modal-category').textContent = `${item.code} // ${item.category} // POTENTIAL PoC: ₹${item.pocValueCr} CRORE`;
    document.getElementById('ev-modal-title').textContent = item.title;
    document.getElementById('ev-modal-desc').textContent = item.description;
    document.getElementById('ev-modal-readout').textContent = item.forensicReadout;

    const optionsEl = document.getElementById('ev-modal-options');
    const feedbackEl = document.getElementById('ev-modal-feedback');
    optionsEl.innerHTML = '';
    feedbackEl.className = 'decision-feedback';
    feedbackEl.textContent = '';

    const existing = gameState.resolvedItems[evidenceId];

    item.decisions.forEach((dec) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'decision-option-btn';
        if (existing) {
            btn.disabled = true;
            btn.style.opacity = existing.decisionId === dec.id ? '1' : '0.45';
            if (existing.decisionId === dec.id) {
                btn.style.borderColor = dec.isOptimal ? 'var(--emerald)' : 'var(--crimson)';
            }
        }
        btn.innerHTML = `
            <span class="opt-badge">OPTION ${dec.id}</span>
            <span>${dec.label}</span>
        `;
        btn.addEventListener('click', () => handleEvidenceDecision(item, dec));
        optionsEl.appendChild(btn);
    });

    if (existing) {
        const chosenDec = item.decisions.find(d => d.id === existing.decisionId);
        if (chosenDec) {
            feedbackEl.className = `decision-feedback visible ${chosenDec.isOptimal ? 'valid' : 'flawed'}`;
            feedbackEl.innerHTML = `<strong>${chosenDec.isOptimal ? '✅ STATUTORY PROTOCOL UPHELD:' : '❌ PROCEDURAL LAPSES RECORDED:'}</strong><br>${chosenDec.ruling}`;
        }
    }

    evModal.showModal();
}

function handleEvidenceDecision(item, dec) {
    if (gameState.resolvedItems[item.id]) return;

    if (dec.isOptimal) {
        sfx.playSuccess();
    } else {
        sfx.playError();
    }

    gameState.resolvedItems[item.id] = {
        decisionId: dec.id,
        isOptimal: dec.isOptimal,
        pocSecuredCr: dec.pocSecuredCr,
        legalityDelta: dec.legalityDelta,
        ruling: dec.ruling
    };

    gameState.pocSecuredCr = Math.min(540, gameState.pocSecuredCr + dec.pocSecuredCr);
    gameState.legalityScore = Math.max(0, Math.min(100, gameState.legalityScore + dec.legalityDelta));

    // Update 3D beacon color to reflect seized status
    const grp = evidenceGroups[item.id];
    if (grp) {
        grp.traverse((ch) => {
            if (ch.geometry && ch.geometry.type === 'RingGeometry') {
                ch.material.color.setHex(dec.isOptimal ? 0x00e676 : 0xff334b);
            }
        });
    }

    renderEvidenceSidebar();
    openEvidenceModal(item.id); // Refresh modal state with ruling

    setToast(`${item.code} processed: ₹${dec.pocSecuredCr.toFixed(2)} Cr PoC secured | Admissibility: ${gameState.legalityScore}%`);
}

// --------------------------------------------------------------------------
// 11. SECTION 50 PMLA SPOT CONFRONTATION MODAL
// --------------------------------------------------------------------------
function openConfrontationModal() {
    sfx.playClick();
    const q = SUSPECT_CONFRONTATION_QUESTIONS[0];
    document.getElementById('confront-question-text').textContent = q.question;
    const optsContainer = document.getElementById('confront-options');
    const feedbackEl = document.getElementById('confront-feedback');
    optsContainer.innerHTML = '';
    feedbackEl.className = 'decision-feedback';

    q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'decision-option-btn';
        if (gameState.sec50Completed) btn.disabled = true;
        btn.innerHTML = `
            <span class="opt-badge">RULING ${idx + 1}</span>
            <span>${opt.text}</span>
        `;
        btn.addEventListener('click', () => {
            if (gameState.sec50Completed) return;
            gameState.sec50Completed = true;
            gameState.legalityScore = Math.max(0, Math.min(100, gameState.legalityScore + opt.bonusLegality));
            if (opt.isCorrect) sfx.playSuccess(); else sfx.playError();

            feedbackEl.className = `decision-feedback visible ${opt.isCorrect ? 'valid' : 'flawed'}`;
            feedbackEl.innerHTML = `<strong>${opt.isCorrect ? '✅ CONSTITUTION BENCH PRECEDENT APPLIED:' : '❌ LEGAL ERROR:'}</strong><br>${opt.explanation}`;
            document.getElementById('badge-sec50').textContent = opt.isCorrect ? '✓ Verified' : '⚠ Flawed';
            renderEvidenceSidebar();
        });
        optsContainer.appendChild(btn);
    });

    confrontModal.showModal();
}

// --------------------------------------------------------------------------
// 12. FINAL PANCHNAMA & SECTION 5(1) PAO DOSSIER GENERATOR
// --------------------------------------------------------------------------
function generateFinalDossier() {
    sfx.playSuccess();
    const resolvedCount = Object.keys(gameState.resolvedItems).length;
    const poc = gameState.pocSecuredCr;
    const leg = gameState.legalityScore;

    let grade = 'A+ (GOLD STANDARD)';
    let summary = '';
    if (poc >= 480 && leg >= 85) {
        grade = 'S-RANK // UNIMPEACHABLE';
        summary = `Outstanding Command Performance! The Adjudicating Authority (PMLA), New Delhi confirmed 100% of your Section 17 Seizure & Section 5(1) Provisional Attachment Order. Defense counsel's challenge under Sec 63 BSA and Vijay Madanlal Choudhary was summarily dismissed with costs.`;
    } else if (poc >= 300 && leg >= 65) {
        grade = 'A-RANK // CONFIRMED';
        summary = `Strong operational recovery of ₹${poc.toFixed(2)} Crore! Most key exhibits withstood scrutiny before the Adjudicating Authority, though minor procedural gaps allowed a fraction of the syndicate's funds to slip through.`;
    } else {
        grade = 'C-RANK // CONTESTED';
        summary = `Warning: Significant Proceeds of Crime (₹${(540 - poc).toFixed(2)} Cr) escaped attachment or suffered chain-of-custody challenges under Sec 63 BSA / Sec 17 PMLA. Review the optimal forensic choices and replay to achieve a watertight S-Rank Panchnama!`;
    }

    document.getElementById('final-poc-val').textContent = `₹${poc.toFixed(2)} Cr`;
    document.getElementById('final-legality-val').textContent = `${leg}%`;
    document.getElementById('final-ruds-val').textContent = `${resolvedCount} / 6`;
    document.getElementById('final-grade-val').textContent = grade;
    document.getElementById('final-verdict-summary').textContent = summary;

    const rudLines = EVIDENCE_ITEMS.map((item) => {
        const res = gameState.resolvedItems[item.id];
        if (!res) return `• ${item.code} (${item.title}): NOT INSPECTED / MISSED DURING SEARCH (₹0.00 Cr)`;
        return `• ${item.code} (${item.title}):\n  Status: ${res.isOptimal ? 'SEIZED WITH FULL STATUTORY PROTOCOL' : 'SEIZED WITH PROCEDURAL DEFECT'}\n  Quantified PoC Secured: ₹${res.pocSecuredCr.toFixed(2)} Crore\n  Legal Note: ${res.ruling}`;
    }).join('\n\n');

    const panchnamaText = `================================================================================
DIRECTORATE OF ENFORCEMENT (RAIPUR & PANAJI ZONAL COMMAND)
SEARCH & SEIZURE PANCHNAMA UNDER SECTION 17 OF PMLA, 2002
================================================================================
ECIR No.              : ${CASE_METADATA.ecir}
Search Warrant Auth   : ${CASE_METADATA.authorizationNo}
Premises Searched     : ${CASE_METADATA.targetPremises}
Occupant / Suspect    : ${CASE_METADATA.suspectName}
Panch Witnesses       : ${CASE_METADATA.panchWitnesses.join(' | ')}
--------------------------------------------------------------------------------
I. STATUTORY COMPLIANCE & REASONS TO BELIEVE (SECTION 17(1) & RULE 3)
Prior to entering the premises at 06:15 HRS IST, the Authorized Officer presented the Search Authorization issued u/s 17(1) of PMLA, 2002 to the occupant in the presence of two independent Panch witnesses, and offered personal search of the raiding party.

II. INVENTORY OF RECOVERED & SEIZED EXHIBITS (RUD-01 TO RUD-06)
${rudLines}

III. SECTION 8 / SECTION 5(1) SECOND PROVISO NEXUS SUMMARY
Total Quantified Proceeds of Crime Secured / Frozen u/s 17(1A): ₹${poc.toFixed(2)} Crore (out of ₹540.00 Cr Syndicate Pool).
Evidentiary Admissibility Rating: ${leg}% (${grade}).
In terms of Section 5(1) Second Proviso of PMLA, 2002, unless the aforesaid movable/immovable properties and VDA balances are immediately attached/frozen, the accused syndicate is likely to conceal, transfer, or deal with the Proceeds of Crime in a manner that will frustrate proceedings relating to confiscation under Chapter III of PMLA.
================================================================================`;

    document.getElementById('panchnama-text-output').textContent = panchnamaText;
    dossierModal.showModal();
}

// --------------------------------------------------------------------------
// 13. WIRE UP DOM EVENT LISTENERS
// --------------------------------------------------------------------------
document.getElementById('btn-enter-house').addEventListener('click', () => {
    sfx.init();
    sfx.playSuccess();
    gameState.started = true;
    document.getElementById('briefing-overlay').classList.add('hidden');
    flyToZone('overview');
});

document.getElementById('btn-show-briefing').addEventListener('click', () => {
    sfx.playClick();
    document.getElementById('briefing-overlay').classList.remove('hidden');
});

document.querySelectorAll('.zone-btn').forEach((btn) => {
    btn.addEventListener('click', () => flyToZone(btn.dataset.zone));
});

document.getElementById('btn-uv-light').addEventListener('click', toggleUVMode);
document.getElementById('btn-scanner-pulse').addEventListener('click', triggerIntelPulse);
document.getElementById('btn-confront-suspect').addEventListener('click', openConfrontationModal);
document.getElementById('btn-conclude-search').addEventListener('click', generateFinalDossier);

document.getElementById('btn-close-ev-modal').addEventListener('click', () => evModal.close());
document.getElementById('btn-ev-continue').addEventListener('click', () => evModal.close());

document.getElementById('btn-close-confront-modal').addEventListener('click', () => confrontModal.close());
document.getElementById('btn-confront-done').addEventListener('click', () => confrontModal.close());

document.getElementById('btn-close-dossier-modal').addEventListener('click', () => dossierModal.close());
document.getElementById('btn-dossier-return').addEventListener('click', () => dossierModal.close());

document.getElementById('btn-copy-panchnama').addEventListener('click', () => {
    const txt = document.getElementById('panchnama-text-output').textContent;
    navigator.clipboard.writeText(txt);
    sfx.playSuccess();
    const copyBtn = document.getElementById('btn-copy-panchnama');
    copyBtn.textContent = '✓ Copied to Clipboard!';
    setTimeout(() => { copyBtn.textContent = '📋 Copy Official Panchnama Draft'; }, 2000);
});

document.getElementById('btn-reset-game').addEventListener('click', () => {
    window.location.reload();
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});

// Initialize Sidebar UI
renderEvidenceSidebar();

// --------------------------------------------------------------------------
// 14. MAIN ANIMATION LOOP
// --------------------------------------------------------------------------
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();

    // Smooth Camera Zone Tweening
    if (activeTween) {
        const now = performance.now();
        const t = Math.min(1, (now - activeTween.startTime) / activeTween.duration);
        const ease = 1 - Math.pow(1 - t, 3); // Cubic ease-out
        camera.position.lerpVectors(activeTween.startPos, activeTween.endPos, ease);
        controls.target.lerpVectors(activeTween.startTarget, activeTween.endTarget, ease);
        if (t >= 1) activeTween = null;
    } else if (gameState.started) {
        updateWASDMovement(delta);
    }

    // Pulse Evidence Beacon Rings
    beaconRings.forEach((ring, i) => {
        const scale = 1 + 0.16 * Math.sin(elapsed * 3.5 + i);
        ring.scale.set(scale, scale, 1);
        ring.material.opacity = gameState.pulseActive ? 1.0 : (0.55 + 0.3 * Math.sin(elapsed * 3 + i));
    });

    controls.update();
    composer.render();
}

animate();
