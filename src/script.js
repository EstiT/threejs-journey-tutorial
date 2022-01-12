import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'


const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = () =>
{
    console.log('loading started')
}
loadingManager.onLoad = () =>
{
    console.log('loading finished')
}
loadingManager.onProgress = () =>
{
    console.log('loading progressing')
}
loadingManager.onError = () =>
{
    console.log('loading error')
}

const textureLoader = new THREE.TextureLoader(loadingManager)
const colorTexture = textureLoader.load('/textures/minecraft.png')
// colorTexture.repeat.x = 2
// colorTexture.repeat.y = 3
// colorTexture.wrapS = THREE.RepeatWrapping //x axis
// colorTexture.wrapT = THREE.RepeatWrapping //y
// colorTexture.rotation =  Math.PI * 0.25
colorTexture.generateMipmaps = false
colorTexture.minFilter = THREE.NearestFilter
colorTexture.magFilter = THREE.NearestFilter
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const heightTexture = textureLoader.load('/textures/door/height.jpg')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')

const matcapTexture = textureLoader.load('/textures/matcaps/1.png')
// const matcapTexture = textureLoader.load('/textures/matcaps/3.png')
// const matcapTexture = textureLoader.load('/textures/matcaps/4.png')
// const matcapTexture = textureLoader.load('/textures/matcaps/5.png')
// const matcapTexture = textureLoader.load('/textures/matcaps/6.png')
// const matcapTexture = textureLoader.load('/textures/matcaps/7.png')
// const matcapTexture = textureLoader.load('/textures/matcaps/8.png')

const material = new THREE.MeshMatcapMaterial()
material.matcap = matcapTexture


const parameters = {
    color: 0xff0000,
    spin: () =>
    {
        gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 })
    }
}

const scene = new THREE.Scene()


const geometry = new THREE.BoxGeometry(1, 1, 1)
const materialLam = new THREE.MeshLambertMaterial()
const materialToon = new THREE.MeshToonMaterial()
materialToon.gradientMap = gradientTexture

// const matcapTexture = new THREE.MeshMatcapMaterial()
// const material = new THREE.MeshNormalMaterial()
// material.transparent = true
// material.opacity = 0.5
material.flatShading = true
material.alphaMap = doorAlphaTexture
// material.side = THREE.DoubleSide
material.matcap = matcapTexture
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    material
)
sphere.position.x = - 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    materialLam
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 16, 32),
    materialToon
)
torus.position.x = 1.5

scene.add(sphere, plane, torus)


// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
// camera.lookAt(mesh.position)
scene.add(camera)



// Renderer
const canvas = document.querySelector('canvas.webgl');
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

const controls = new OrbitControls(camera, canvas) // allows click and drag shape
// controls.target.y = 2
controls.enableDamping = true

const cursor = {
    x: 0,
    y: 0
}
const clock = new THREE.Clock()
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 2
    // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 2
    // camera.position.y = cursor.y * 3
    // camera.lookAt(mesh.position)
    sphere.rotation.y = 0.1 * elapsedTime
    plane.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    plane.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()


const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)
const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = -(event.clientY / sizes.height - 0.5)
})

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

window.addEventListener('dblclick', () =>
{
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

    if(!fullscreenElement)
    {
        if(canvas.requestFullscreen)
        {
            canvas.requestFullscreen()
        }
        else if(canvas.webkitRequestFullscreen)
        {
            canvas.webkitRequestFullscreen()
        }
    }
    else
    {
        if(document.exitFullscreen)
        {
            document.exitFullscreen()
        }
        else if(document.webkitExitFullscreen)
        {
            document.webkitExitFullscreen()
        }
    }
})


// Debug
const gui = new dat.GUI()
// gui.add(mesh.position, 'y').min(- 3).max(3).step(0.01).name('elevation')
// gui.add(mesh, 'visible')
// gui.add(material, 'wireframe')
gui.addColor(parameters, 'color')    
    .onChange(() =>
    {
        material.color.set(parameters.color)
    })
gui.add(parameters, 'spin')
    