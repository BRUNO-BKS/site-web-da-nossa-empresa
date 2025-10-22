(function(){
  function isMobile(){
    var ua = navigator.userAgent;
    var mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    var isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    var small = window.innerWidth <= 768;
    return mobileRegex.test(ua) || (isTouch && small);
  }

  var amount = isMobile() ? 3 : 4;

  var vertexShader = (
    "varying vec2 v_uv;\n"+
    "void main() {\n"+
    "  v_uv = uv;\n"+
    "  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n"+
    "}\n"
  );

  var GLSL_ROTATE = (
    "mat4 rotationMatrix(vec3 axis, float angle) {\n"+
    "  axis = normalize(axis);\n"+
    "  float s = sin(angle);\n"+
    "  float c = cos(angle);\n"+
    "  float oc = 1.0 - c;\n"+
    "  return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,\n"+
    "              oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,\n"+
    "              oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,\n"+
    "              0.0,                                0.0,                                0.0,                                1.0);\n"+
    "}\n"+
    "vec3 rotate(vec3 v, vec3 axis, float angle) {\n"+
    "  mat4 m = rotationMatrix(axis, angle);\n"+
    "  return (m * vec4(v, 1.0)).xyz;\n"+
    "}\n"
  );

  var GLSL_SDF = (
    "float sdBox( vec3 p, vec3 b ) {\n"+
    "  vec3 q = abs(p) - b;\n"+
    "  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);\n"+
    "}\n"
  );

  var GLSL_OPER = (
    "float opSmoothUnion( float d1, float d2, float k ) {\n"+
    "  float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );\n"+
    "  return mix( d2, d1, h ) - k*h*(1.0-h);\n"+
    "}\n"
  );

  function createFragmentShader(count){
    var MAX_STEPS = 128;
    var PRECISION = 0.0005;
    return (
      "uniform float u_time;\n"+
      "uniform float u_aspect;\n"+
      "uniform vec3 u_positions["+count+"];\n"+
      "uniform vec3 u_rotations["+count+"];\n"+
      "varying vec2 v_uv;\n"+
      GLSL_SDF + GLSL_OPER + GLSL_ROTATE +
      "float sdf(vec3 p) {\n"+
      "  vec3 correct = 0.1 * vec3(u_aspect, 1.0, 1.0);\n"+
      "  vec3 tp = p + -u_positions[0] * correct;\n"+
      "  vec3 rp = tp;\n"+
      "  rp = rotate(rp, vec3(1.0, 1.0, 0.0), u_rotations[0].x + u_rotations[0].y);\n"+
      "  float final = sdBox(rp, vec3(0.15)) - 0.03;\n"+
      "  for(int i = 1; i < " + count + "; i++) {\n"+
      "    tp = p + -u_positions[i] * correct;\n"+
      "    rp = tp;\n"+
      "    rp = rotate(rp, vec3(1.0, 1.0, 0.0), u_rotations[i].x + u_rotations[i].y);\n"+
      "    float box = sdBox(rp, vec3(0.15)) - 0.03;\n"+
      "    final = opSmoothUnion(final, box, 0.4);\n"+
      "  }\n"+
      "  return final;\n"+
      "}\n"+
      "vec3 calcNormal(in vec3 p) {\n"+
      "  const float h = 0.001;\n"+
      "  return normalize(vec3(\n"+
      "    sdf(p + vec3(h, 0, 0)) - sdf(p - vec3(h, 0, 0)),\n"+
      "    sdf(p + vec3(0, h, 0)) - sdf(p - vec3(0, h, 0)),\n"+
      "    sdf(p + vec3(0, 0, h)) - sdf(p - vec3(0, 0, h))\n"+
      "  ));\n"+
      "}\n"+
      "vec3 getIridescence(vec3 normal, vec3 viewDir, float time) {\n"+
      "  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.0);\n"+
      "  float hue = dot(normal, viewDir) * 3.14159 + time * 0.5;\n"+
      "  vec3 greenShades = vec3(0.0, sin(hue) * 0.3 + 0.7, sin(hue + 1.0) * 0.2 + 0.3);\n"+
      "  return greenShades * fresnel * 1.2;\n"+
      "}\n"+
      "vec3 getBackground(vec2 uv) { return vec3(0.0); }\n"+
      "void main(){\n"+
      "  vec2 centeredUV = (v_uv - 0.5) * vec2(u_aspect, 1.0);\n"+
      "  vec3 ray = normalize(vec3(centeredUV, -1.0));\n"+
      "  vec3 camPos = vec3(0.0, 0.0, 2.3);\n"+
      "  vec3 rayPos = camPos;\n"+
      "  float totalDist = 0.0;\n"+
      "  float tMax = 5.0;\n"+
      "  for(int i=0;i<"+MAX_STEPS+";i++){\n"+
      "    float dist = sdf(rayPos);\n"+
      "    if(dist < "+PRECISION+" || tMax < totalDist) break;\n"+
      "    totalDist += dist;\n"+
      "    rayPos = camPos + totalDist * ray;\n"+
      "  }\n"+
      "  vec3 color = vec3(0.0);\n"+
      "  float alpha = 0.0;\n"+
      "  if(totalDist < tMax){\n"+
      "    vec3 normal = calcNormal(rayPos);\n"+
      "    vec3 viewDir = normalize(camPos - rayPos);\n"+
      "    vec3 lightDir = normalize(vec3(-0.5, 0.8, 0.6));\n"+
      "    float diff = max(dot(normal, lightDir), 0.0);\n"+
      "    vec3 halfDir = normalize(lightDir + viewDir);\n"+
      "    float spec = pow(max(dot(normal, halfDir), 0.0), 32.0);\n"+
      "    vec3 iridescent = getIridescence(normal, viewDir, u_time);\n"+
      "    float rimLight = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);\n"+
      "    vec3 rimColor = vec3(0.4, 0.8, 1.0) * rimLight * 0.5;\n"+
      "    float ao = 1.0 - smoothstep(0.0, 0.3, totalDist / tMax);\n"+
      "    vec3 baseColor = vec3(0.1, 0.12, 0.15);\n"+
      "    color = baseColor * (0.1 + diff * 0.4) * ao;\n"+
      "    color += iridescent * (0.8 + diff * 0.2);\n"+
      "    color += vec3(1.0, 0.9, 0.8) * spec * 0.6;\n"+
      "    color += rimColor;\n"+
      "    float fog = 1.0 - exp(-totalDist * 0.2);\n"+
      "    vec3 fogColor = getBackground(centeredUV) * 0.3;\n"+
      "    color = mix(color, fogColor, fog);\n"+
      "    alpha = 1.0;\n"+
      "  }\n"+
      "  gl_FragColor = vec4(color, alpha);\n"+
      "}\n"
    );
  }

  var container = document.getElementById('bg-canvas');
  if(!container){
    container = document.createElement('div');
    container.id = 'bg-canvas';
    document.body.prepend(container);
  }

  var width = container.clientWidth || window.innerWidth;
  var height = container.clientHeight || window.innerHeight;

  var renderer = new THREE.WebGLRenderer({ antialias: !isMobile(), alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  var scene = new THREE.Scene();
  var camera = new THREE.OrthographicCamera(-width/2, width/2, height/2, -height/2, 0.1, 1000);
  camera.position.z = 10;

  var geometry = new THREE.PlaneGeometry(width, height, 1, 1);

  var positions = new Array(amount);
  var rotations = new Array(amount);
  var baseOffsets = new Array(amount);
  for(var i=0;i<amount;i++){
    positions[i] = new THREE.Vector3(0,0,0);
    rotations[i] = new THREE.Vector3(0,0,0);
    var t = (i/amount) * Math.PI * 2;
    baseOffsets[i] = {
      x: Math.cos(t) * 1.75,
      y: Math.sin(t) * 4.5,
      posSpeed: new THREE.Vector3(1.0 + Math.random()*4, 1.0 + Math.random()*3.5, 0.5 + Math.random()*2.0),
      rotSpeed: new THREE.Vector3(0.1 + Math.random()*1, 0.1 + Math.random()*1, 0.1 + Math.random()*1),
      posPhase: new THREE.Vector3(t + Math.random()*Math.PI*3.0, t*1.3 + Math.random()*Math.PI*3.0, t*0.7 + Math.random()*Math.PI*3.0),
      rotPhase: new THREE.Vector3(t*0.5 + Math.random()*Math.PI*2.0, t*0.8 + Math.random()*Math.PI*2.0, t*1.1 + Math.random()*Math.PI*2.0)
    };
  }

  var material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: createFragmentShader(amount),
    uniforms: {
      u_time: { value: 0 },
      u_aspect: { value: width/height },
      u_positions: { value: positions },
      u_rotations: { value: rotations }
    },
    transparent: true
  });

  var mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  baseOffsets.forEach(function(offset, i){
    positions[i].set(offset.x, offset.y, 0);
    rotations[i].set(0,0,0);
  });

  var last = performance.now();
  function animate(now){
    var dt = Math.min(0.05, (now - last)/1000);
    last = now;
    material.uniforms.u_time.value += dt;
    var time = material.uniforms.u_time.value;

    baseOffsets.forEach(function(offset, i){
      var wanderX = Math.sin(time * offset.posSpeed.x + offset.posPhase.x) * 0.8;
      var wanderY = Math.cos(time * offset.posSpeed.y + offset.posPhase.y) * 5;
      var wanderZ = Math.sin(time * offset.posSpeed.z + offset.posPhase.z) * 0.5;
      var secondaryX = Math.cos(time * offset.posSpeed.x * 0.7 + offset.posPhase.x * 1.3) * 0.4;
      var secondaryY = Math.sin(time * offset.posSpeed.y * 0.8 + offset.posPhase.y * 1.1) * 0.3;
      positions[i].set(offset.x + wanderX + secondaryX, offset.y + wanderY + secondaryY, wanderZ);
      rotations[i].set(
        time * offset.rotSpeed.x + offset.rotPhase.x,
        time * offset.rotSpeed.y + offset.rotPhase.y,
        time * offset.rotSpeed.z + offset.rotPhase.z
      );
    });

    material.uniforms.u_positions.value = positions;
    material.uniforms.u_rotations.value = rotations;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  function onResize(){
    var w = container.clientWidth || window.innerWidth;
    var h = container.clientHeight || window.innerHeight;
    renderer.setSize(w, h);
    camera.left = -w/2; camera.right = w/2; camera.top = h/2; camera.bottom = -h/2; camera.updateProjectionMatrix();
    mesh.geometry.dispose();
    mesh.geometry = new THREE.PlaneGeometry(w, h, 1, 1);
    material.uniforms.u_aspect.value = w/h;
  }
  window.addEventListener('resize', onResize);
})();
