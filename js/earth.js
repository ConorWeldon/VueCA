import * as THREE from '/node_modules/three/src/Three.js';
    import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';
    import { FlakesTexture } from 'https://threejs.org/examples/jsm/textures/FlakesTexture.js';
    import { RGBELoader } from 'https://threejs.org/examples/jsm/loaders/RGBELoader.js';

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    // const scene = new THREE.Scene();

    let scene, camera, renderer, controls, pointlight;
    function init() {
        scene = new THREE.Scene();

        //set scene background to transparent so can see the background
        renderer = new THREE.WebGLRenderer({alpha:true,antialias:true});
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.25;

        camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 1, 1000);
        camera.position.set(0, 0, 300);
        controls = new OrbitControls(camera, renderer.domElement);

        controls.autoRotate = true;         //Orbit
        controls.autoRotateSpeed = 0.5;
        controls.enableDampening = true;    //Smoothes Control

        //LIGHTS
        pointlight = new THREE.PointLight(0xffffff, 1);
        pointlight.position.set(200, 200, 200);
        scene.add(pointlight);

        let envmaploader = new THREE.PMREMGenerator(renderer);

        new RGBELoader().setPath('textures/').load('chinese_garden_4k.hdr', function(hdrmap) {

            //TEXTURE
            let envmap = envmaploader.fromCubemap(hdrmap);  
            let texture =  new THREE.TextureLoader().load( "textures/2k_earth_daymap.jpg" ); /*new THREE.CanvasTexture(new FlakesTexture());*/
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.x = 1;      //Horizontal x10
            texture.repeat.y = 1;       //Vertical x6

            const ballMaterial = {
                // clearcoat: 1.0,
                // clearcoatRoughness: 0.1,
                // metalness: 0.9,
                roughness: 0.5,
                // color: 0x8418ca,
                // normalMap: texture,
                map: texture,
                normalScale: new THREE.Vector2(0.15, 0.15),
                // envMap: envmap.texture
            };

            //SPHERE
            let ballGeo = new THREE.SphereGeometry(100, 64, 64);
            let ballMat = new THREE.MeshPhysicalMaterial(ballMaterial);
            let ballMesh = new THREE.Mesh(ballGeo, ballMat);
            scene.add(ballMesh);

            animate(); //Rendering my loop
        });

        // //TEXTURE
        // let texture = new THREE.TextureLoader().load( "textures/2k_earth_daymap.jpg" );
        // texture.wrapS = THREE.RepeatWrapping;
        // texture.wrapT = THREE.RepeatWrapping;
        // texture.repeat.x = 1;      //Horizontal x10
        // texture.repeat.y = 1;       //Vertical x6

        // const ballMaterial = {
        //     // clearcoat: 1.0,
        //     // clearcoatRoughness: 0.1,
        //     // metalness: 0.9,
        //     // roughness: 0.5,
        //     // // color: 0x8418ca,
        //     // normalMap: texture,
        //     map: texture,
        //     normalScale: new THREE.Vector2(0.15, 0.15)
        // };

        // //SPHERE
        // let ballGeo = new THREE.SphereGeometry(100, 64, 64);
        // let ballMat = new THREE.MeshPhysicalMaterial(ballMaterial);
        // let ballMesh = new THREE.Mesh(ballGeo, ballMat);
        // scene.add(ballMesh);

        animate(); //Rendering my loop
    }

    function onMouseMove( event ) {
        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    
    }

    function render() {
        // update the picking ray with the camera and mouse position
        raycaster.setFromCamera( mouse, camera );
    
        // calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObjects( scene.children );
    
        for ( let i = 0; i < intersects.length; i ++ ) {
    
            // intersects[ i ].object.material.color.set( 0xff0000 );
            console.log(mouse.x, mouse.y);
        }
    
        renderer.render( scene, camera );
    }

    function animate() {
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
        addEventListener( 'mousemove', onMouseMove, false );
        requestAnimationFrame(render);
    }

    //To start Scene
    init();