import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap'

/**
 * Debug
 */
const gui = new dat.GUI()

const parameters = {
    materialColor: '#ffeded'
}

gui
    .addColor(parameters, 'materialColor')
    .onChange(() =>
    {
        material.color.set(parameters.materialColor)
        particlesMaterial.color.set(parameters.materialColor)
    })

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Texture
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('textures/gradients/3.jpg')
// gradientTexture.magFilter = THREE.NearestFilter

const objectsDistance = 4

const material = new THREE.MeshToonMaterial({ 
    color: parameters.materialColor,
    gradientMap: gradientTexture 
})
const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
   material
)
// mesh1.position.y = 2
// mesh1.scale.set(0.5, 0.5, 0.5)

const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
)
// mesh2.position.y = 0
// mesh2.scale.set(0.5, 0.5, 0.5)

const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
)
// mesh3.position.y = - 2
// mesh3.scale.set(0.5, 0.5, 0.5)

mesh1.position.y = - objectsDistance * 0
mesh2.position.y = - objectsDistance * 1
mesh3.position.y = - objectsDistance * 2

mesh1.position.x = 2
mesh2.position.x = - 2
mesh3.position.x = 2

scene.add(mesh1, mesh2, mesh3)

const sectionMeshes = [ mesh1, mesh2, mesh3 ]


/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Particles
 */
// Geometry
const particlesCount = 200
const positions = new Float32Array(particlesCount * 3)
for(let i = 0; i < particlesCount; i++)
{
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}
const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
// Material
const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: 0.03
})
// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)


/**
 * Scroll
 */
let currentSection = 0
let scrollY = window.scrollY
window.addEventListener('scroll', () =>
{
    scrollY = window.scrollY
    const newSection = Math.round(scrollY / sizes.height)
    if(newSection != currentSection)
    {
        currentSection = newSection
        gsap.to(
            sectionMeshes[currentSection].rotation,
            {
                duration: 1.5,
                ease: 'power2.inOut',
                x: '+=6',
                y: '+=3',
                z: '+=1.5'
            }
        )
    }
})


/**
 * Cursor
 */
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const deltaTime = clock.getDelta()
    const elapsedTime = clock.getElapsedTime()
    // Animate meshes
    for(const mesh of sectionMeshes)
    {
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.12
    }

    camera.position.y = - scrollY / sizes.height * objectsDistance

    cameraGroup.position.x = cursor.x * 0.5
    cameraGroup.position.y = - cursor.y * 0.5

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

