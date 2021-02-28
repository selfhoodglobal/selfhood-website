var isMobile = false;
if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
    isMobile = true;
}
if (navigator.userAgent.match(/Mac/) && navigator.maxTouchPoints && navigator.maxTouchPoints > 2) {
    isMobile = true;
}
if ($(window).width() < 992) {
    isMobile = true;
}
if (!isMobile) {
    window.addEventListener("load", function() {

        function lerp(start, end, amt) {
            return (1 - amt) * start + amt * end;
        }

        // track the mouse positions to send it to the shaders
        var mousePosition = {
            x: 0,
            y: 0,
        };
        // we will keep track of the last position in order to calculate the movement strength/delta
        var mouseLastPosition = {
            x: 0,
            y: 0,
        };

        var deltas = {
            max: 0,
            applied: 0,
        };

        // set up our WebGL context and append the canvas to our wrapper
        var webGLCurtain = new Curtains({
            container: "canvas",
            watchScroll: false // no need to listen for the scroll in this example
        });

        // get our plane element
        var planeElements = document.getElementsByClassName("curtain");


        var vs = `
        precision mediump float;

        // default mandatory variables
        attribute vec3 aVertexPosition;
        attribute vec2 aTextureCoord;

        uniform mat4 uMVMatrix;
        uniform mat4 uPMatrix;
        
        // our texture matrix uniform
        uniform mat4 activeTexMatrix;

        // custom variables
        varying vec3 vVertexPosition;
        varying vec2 vTextureCoord;

        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec2 uMousePosition;
        uniform float uMouseMoveStrength;


        void main() {

            vec3 vertexPosition = aVertexPosition;

            // get the distance between our vertex and the mouse position
            float distanceFromMouse = distance(uMousePosition, vec2(vertexPosition.x, vertexPosition.y));

            // calculate our wave effect
            float waveSinusoid = cos(5.0 * (distanceFromMouse - (uTime / 75.0)));

            // attenuate the effect based on mouse distance
            float distanceStrength = (0.4 / (distanceFromMouse + 0.4));

            // calculate our distortion effect
            float distortionEffect = distanceStrength * waveSinusoid * uMouseMoveStrength;

            // apply it to our vertex position
            vertexPosition.z +=  distortionEffect / 30.0;
            vertexPosition.x +=  (distortionEffect / 30.0 * (uResolution.x / uResolution.y) * (uMousePosition.x - vertexPosition.x));
            vertexPosition.y +=  distortionEffect / 30.0 * (uMousePosition.y - vertexPosition.y);

            gl_Position = uPMatrix * uMVMatrix * vec4(vertexPosition, 1.0);

            // varyings
            vTextureCoord = (activeTexMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;
            vVertexPosition = vertexPosition;
        }
    `;

        var fs = `
        precision mediump float;

        varying vec3 vVertexPosition;
        varying vec2 vTextureCoord;

        uniform sampler2D activeTex;

        void main() {
            // apply our texture
            vec4 finalColor = texture2D(activeTex, vTextureCoord);

            // fake shadows based on vertex position along Z axis
            finalColor.rgb -= clamp(-vVertexPosition.z, 0.0, 1.0);
            // fake lights based on vertex position along Z axis
            finalColor.rgb += clamp(vVertexPosition.z, 0.0, 1.0);

            // handling premultiplied alpha (useful if we were using a png with transparency)
            finalColor = vec4(finalColor.rgb * finalColor.a, finalColor.a);

            gl_FragColor = finalColor;
        }
    `;

        // some basic parameters
        var params = {
            vertexShader: vs,
            fragmentShader: fs,
            widthSegments: 20,
            heightSegments: 20,
            uniforms: {
                resolution: { // resolution of our plane
                    name: "uResolution",
                    type: "2f", // notice this is an length 2 array of floats
                    value: [planeElements[0].clientWidth, planeElements[0].clientHeight],
                },
                time: { // time uniform that will be updated at each draw call
                    name: "uTime",
                    type: "1f",
                    value: 0,
                },
                mousePosition: { // our mouse position
                    name: "uMousePosition",
                    type: "2f", // again an array of floats
                    value: [mousePosition.x, mousePosition.y],
                },
                mouseMoveStrength: { // the mouse move strength
                    name: "uMouseMoveStrength",
                    type: "1f",
                    value: 0,
                }
            }
        };

        // create our plane
        var simplePlane = webGLCurtain.addPlane(planeElements[0], params);

        var activeTex = simplePlane.createTexture({
            sampler: "activeTex",
        });

        activeTex.setFromTexture(simplePlane.textures[0]);

        // if there has been an error during init, simplePlane will be null
        simplePlane && simplePlane.onReady(function() {
            // set a fov of 35 to reduce perspective
            simplePlane.setPerspective(35);

            // apply a little effect once everything is ready
            deltas.max = 5;

            activeTex.setFromTexture(simplePlane.textures[0]);

            // now that our plane is ready we can listen to mouse move event
            var wrapper = document.getElementById("page-wrap");

            //simplePlane.textures[0].setScale(0.25, 0.25);
            //simplePlane.textures[0].setOffset(-0.5, 0);

            wrapper.addEventListener("mousemove", function(e) {
                handleMovement(e, simplePlane);
            });

            wrapper.addEventListener("touchmove", function(e) {
                handleMovement(e, simplePlane);
            });

        }).onRender(function() {
            // increment our time uniform
            simplePlane.uniforms.time.value++;

            // decrease both deltas by damping : if the user doesn't move the mouse, effect will fade away
            deltas.applied += (deltas.max - deltas.applied) * 0.02;
            deltas.max += (0 - deltas.max) * 0.01;

            // send the new mouse move strength value
            simplePlane.uniforms.mouseMoveStrength.value = deltas.applied;

        }).onAfterResize(function() {
            var planeBoundingRect = simplePlane.getBoundingRect();
            simplePlane.uniforms.resolution.value = [planeBoundingRect.width, planeBoundingRect.height];
        });

        // handle the mouse move event
        function handleMovement(e, plane) {

            // update mouse last pos
            mouseLastPosition.x = mousePosition.x;
            mouseLastPosition.y = mousePosition.y;

            var mouse = {};

            // touch event
            if (e.targetTouches) {

                mouse.x = e.targetTouches[0].clientX;
                mouse.y = e.targetTouches[0].clientY;
            }
            // mouse event
            else {
                mouse.x = e.clientX;
                mouse.y = e.clientY;
            }

            // lerp the mouse position a bit to smoothen the overall effect
            mousePosition.x = lerp(mousePosition.x, mouse.x, 0.3);
            mousePosition.y = lerp(mousePosition.y, mouse.y, 0.3);

            // convert our mouse/touch position to coordinates relative to the vertices of the plane
            var mouseCoords = plane.mouseToPlaneCoords(mousePosition.x, mousePosition.y);
            // update our mouse position uniform
            plane.uniforms.mousePosition.value = [mouseCoords.x, mouseCoords.y];

            // calculate the mouse move strength
            if (mouseLastPosition.x && mouseLastPosition.y) {
                var delta = Math.sqrt(Math.pow(mousePosition.x - mouseLastPosition.x, 2) + Math.pow(mousePosition.y - mouseLastPosition.y, 2)) / 30;
                delta = Math.min(4, delta);
                // update max delta only if it increased
                if (delta >= deltas.max) {
                    deltas.max = delta;
                }
            }
        }
    });
}
