import * as THREE from './three.module.js'
import { OrbitControls } from './OrbitControls.js';

var TRUNC_CHUNCKS_NBR = 12; // nombre de morceau du trunc
var TRUNC_CHUNK_SIZE = 12; //  hauteur d'un morceau de tronc
var BRANCH_NBR = 5;
var BRANCH_SIZE = 2;
var BRANCH_GEN_MAX = 5;
var LARGEUR_FEUILLAGE = 3;
var HAUTEUR_FEUILLAGE = 10;

var reload = false;

var area = new THREE.Vector3(100, 0, 100);
var NBR_TREES = 100;


const PI = 3.141592653589793;

const material = new THREE.LineBasicMaterial({ color: 0x0000ff });

document.addEventListener("DOMContentLoaded", () => {

    //inputs

    var input_TRUNC_CHUNCKS_NBR = document.getElementById("TRUNC_CHUNCKS_NBR")
    var input_TRUNC_CHUNK_SIZE = document.getElementById("TRUNC_CHUNK_SIZE")
    var input_BRANCH_NBR = document.getElementById("BRANCH_NBR")
    var input_BRANCH_SIZE = document.getElementById("BRANCH_SIZE")
    var input_BRANCH_GEN_MAX = document.getElementById("BRANCH_GEN_MAX")
    var input_LARGEUR_FEUILLAGE = document.getElementById("LARGEUR_FEUILLAGE")
    var input_HAUTEUR_FEUILLAGE = document.getElementById("HAUTEUR_FEUILLAGE")
    var input_NBR_TREES = document.getElementById("NBR_TREES")
    var input_AREA_SIZE = document.getElementById("AREA_SIZE")


    TRUNC_CHUNCKS_NBR = input_TRUNC_CHUNCKS_NBR.value; // nombre de morceau du trunc
    TRUNC_CHUNK_SIZE = input_TRUNC_CHUNK_SIZE.value; //  hauteur d'un morceau de tronc
    BRANCH_NBR = input_BRANCH_NBR.value;
    BRANCH_SIZE = input_BRANCH_SIZE.value;
    BRANCH_GEN_MAX = input_BRANCH_GEN_MAX.value;
    LARGEUR_FEUILLAGE = input_LARGEUR_FEUILLAGE.value;
    HAUTEUR_FEUILLAGE = input_HAUTEUR_FEUILLAGE.value;


    input_TRUNC_CHUNCKS_NBR.addEventListener("change", (event) => { TRUNC_CHUNCKS_NBR = event.target.value; console.log(TRUNC_CHUNCKS_NBR); reload = true; });
    input_TRUNC_CHUNK_SIZE.addEventListener("change", (event) => { TRUNC_CHUNK_SIZE = event.target.value; console.log(TRUNC_CHUNK_SIZE); reload = true; })
    input_BRANCH_NBR.addEventListener("change", (event) => { BRANCH_NBR = event.target.value; console.log(BRANCH_NBR); reload = true; })
    input_BRANCH_SIZE.addEventListener("change", (event) => { BRANCH_SIZE = event.target.value; console.log(BRANCH_SIZE); reload = true; })
    input_BRANCH_GEN_MAX.addEventListener("change", (event) => { BRANCH_GEN_MAX = event.target.value; console.log(BRANCH_GEN_MAX); reload = true; })
    input_LARGEUR_FEUILLAGE.addEventListener("change", (event) => { LARGEUR_FEUILLAGE = event.target.value; console.log(LARGEUR_FEUILLAGE); reload = true; })
    input_HAUTEUR_FEUILLAGE.addEventListener("change", (event) => { HAUTEUR_FEUILLAGE = event.target.value; console.log(HAUTEUR_FEUILLAGE); reload = true; })
    input_NBR_TREES.addEventListener("change", (event) => { NBR_TREES = event.target.value; console.log(NBR_TREES); reload = true; })
    input_AREA_SIZE.addEventListener("change", (event) => { area = new THREE.Vector3(event.target.value, 0, event.target.value); console.log(AREA_SIZE); reload = true; })


    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);

    const scene = new THREE.Scene();

    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(350, 75, 0);
    renderer.setClearColor("White");
    generate_forest(scene);

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    function render() {
        if (reload) {
            while (scene.children.length > 0) {
                scene.remove(scene.children[0]);
            }
            generate_forest(scene);
            reload = false;
        }
        requestAnimationFrame(render);
        renderer.render(scene, camera);
        controls.update();
    };

    render();

})

function generate_forest(scene) {

    for (var i = 0; i < NBR_TREES; i++) {
        scene.add(a_tree());
    }


}

function a_tree() {
    const tree = new THREE.Group();
    var points = [];
    var random_pos = new THREE.Vector3(area.x / 2 - (Math.random() * (area.x)), 1, area.z / 2 - (Math.random() * (area.z)));

    var tree_high_steps = Math.floor(Math.random() * TRUNC_CHUNCKS_NBR) + 2;

    for (var i = 0; i < tree_high_steps; i++) {
        points.push(new THREE.Vector3(random_pos.x + Math.random() - 0.5, random_pos.y + Math.random() * TRUNC_CHUNK_SIZE, random_pos.z + Math.random() - 0.5));
        random_pos = points[points.length - 1]
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const truncmesh = new THREE.Line(geometry, material);
    tree.add(truncmesh);

    var array_of_branches = branches(points[points.length - 1]);
    array_of_branches.forEach(branch => tree.add(branch));

    return tree
}


function branches(last_pos, group = [], generation = 0) {
    if (generation >= BRANCH_GEN_MAX) return group
    var nbr_ramot = Math.floor(Math.random() * BRANCH_NBR);
    var angle = (2 * PI) / nbr_ramot;


    for (var i = 0; i < nbr_ramot; i++) {
        const points = []
        points.push(last_pos)
        points.push(new THREE.Vector3(
            last_pos.x + BRANCH_SIZE * Math.cos(angle * i) * LARGEUR_FEUILLAGE - LARGEUR_FEUILLAGE / 2,
            last_pos.y + Math.random() * HAUTEUR_FEUILLAGE,
            last_pos.z + BRANCH_SIZE * Math.sin(angle * i) * LARGEUR_FEUILLAGE - LARGEUR_FEUILLAGE / 2))
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const branchmesh = new THREE.Line(geometry, material);
        group.push(branchmesh);
        branches(points[1], group, generation + 1);
    }
    return group;
}