// Three.js 3D scene setup
export function setupThreeScene(state) {
  // Three.js 3D 씬 설정
  const scene = new THREE.Scene();
  const floorColor = 0x1a1a1a; // 약간 밝은 검은색
  scene.background = new THREE.Color(floorColor); // 배경과 바닥 색상 통일
  scene.fog = new THREE.Fog(floorColor, 20, 100); // 안개 효과로 무한 느낌

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // 배경 투명 가능하도록
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.getElementById('three-container').appendChild(renderer.domElement);

  // 무한 확장되는 바닥 (매우 크게)
  const roomSize = 200;
  const floorGeometry = new THREE.PlaneGeometry(roomSize, roomSize);
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: floorColor,
    roughness: 0.9,
    metalness: 0.1
  });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -5;
  floor.receiveShadow = true;
  scene.add(floor);
  window.floorMesh = floor; // 나중에 제거할 수 있도록 저장

  // GLB 램프 모델 로드
  const lampGroup = new THREE.Group();
  lampGroup.position.set(0, -5.0, 0); // 바닥에 더 가까이
  scene.add(lampGroup);

  // GLTFLoader로 GLB 파일 로드
  const loader = new THREE.GLTFLoader();
  loader.load('alladins_lamp.glb',
    function (gltf) {
      console.log('✨ Lamp model loaded!');
      const lampModel = gltf.scene;

      // 크기 조정 (적당한 크기)
      lampModel.scale.set(12.0, 12.0, 12.0);

      // 회전 (180도)
      lampModel.rotation.y = Math.PI;

      // 그림자 설정
      lampModel.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      lampGroup.add(lampModel);
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
      console.error('❌ Error loading lamp model:', error);
    }
  );

  // 조명 설정 (밝게)
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.2); // 0.5 → 1.2
  scene.add(ambientLight);

  // 램프에서 나오는 밝은 빛
  const lampLight = new THREE.PointLight(0xffffff, 8, 60); // 4 → 8
  lampLight.position.set(0, -4.5, 0); // 램프 위치에 맞춤
  scene.add(lampLight);

  // 메인 조명 (왼쪽으로 60도 회전, 낮은 각도)
  const mainLight = new THREE.DirectionalLight(0xffffff, 1.5); // 0.9 → 1.5
  mainLight.position.set(-3.3, 1.5, -6.7); // 왼쪽 60도, 낮은 위치
  mainLight.target.position.set(0, -5, 0); // 램프를 향함
  scene.add(mainLight.target);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.width = 2048;
  mainLight.shadow.mapSize.height = 2048;
  mainLight.shadow.camera.left = -10;
  mainLight.shadow.camera.right = 10;
  mainLight.shadow.camera.top = 10;
  mainLight.shadow.camera.bottom = -10;
  mainLight.shadow.camera.near = 0.5;
  mainLight.shadow.camera.far = 20;
  scene.add(mainLight);

  // 카메라 초기 위치 설정
  camera.position.set(1.98, -0.12, -4.35);
  camera.lookAt(0, -5, 0); // 램프를 바라봄
  camera.fov = 95;
  camera.updateProjectionMatrix();

  // 키보드 회전용 변수 (OrbitControls와 별도)
  let cameraDistance = Math.sqrt(1.98 * 1.98 + 4.35 * 4.35);
  let cameraAngle = Math.atan2(-4.35, 1.98);
  let cameraHeight = -0.12;

  function updateCameraPosition() {
    camera.position.x = Math.cos(cameraAngle) * cameraDistance;
    camera.position.y = cameraHeight;
    camera.position.z = Math.sin(cameraAngle) * cameraDistance;
    camera.lookAt(0, -5, 0); // 램프를 바라봄
  }

  // 키보드 회전을 위한 상수
  const maxRotationSpeed = 0.03;
  const rotationAcceleration = 0.002;
  const rotationDeceleration = 0.001;

  // Three.js 애니메이션
  function animateThree() {
    requestAnimationFrame(animateThree);

    // 램프 불빛이 아주 은은하게 깜박임 (초기 상태보다 어두워지지 않도록 수정)
    // 기본 조명(8)을 minimum으로 하고, 더 밝게만 변화
    lampLight.intensity = 8 + Math.sin(Date.now() * 0.0008) * 1.5; // 8~9.5 사이로 변화

    // 램프 흔들림 애니메이션 (touch 횟수에 따라 점진적으로 강해짐)
    if (state.lampShaking) {
      const elapsed = (Date.now() - state.lampShakeStartTime) / 1000; // 초 단위

      // touch 횟수에 따른 강도와 지속 시간 (1->2->3)
      const intensityMultiplier = state.touchCount * 0.4; // 0.4, 0.8, 1.2 (첫번째 더 약하게)
      const duration = state.touchCount === 1 ? 1.5 : (state.touchCount === 2 ? 2.5 : 4); // 1.5초, 2.5초, 4초

      if (elapsed < duration) {
        const t = elapsed / duration; // 0~1

        // ease-in-out 함수로 부드러운 시작과 끝
        const easeInOut = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const shake = (1 - easeInOut); // 점점 약해짐 (부드럽게)

        // 시작 부분 ease-in (처음 0.2초 동안 점진적으로 강해짐)
        const easeInFactor = elapsed < 0.2 ? (elapsed / 0.2) * (elapsed / 0.2) : 1; // quadratic ease-in

        const finalShake = shake * easeInFactor;

        lampGroup.rotation.x = Math.sin(Date.now() * 0.008) * finalShake * 0.3 * intensityMultiplier;
        lampGroup.rotation.y = Math.sin(Date.now() * 0.011) * finalShake * 0.4 * intensityMultiplier;
        lampGroup.rotation.z = Math.sin(Date.now() * 0.009) * finalShake * 0.25 * intensityMultiplier;
      } else {
        // 원위치로 부드럽게 복귀
        lampGroup.rotation.x *= 0.85;
        lampGroup.rotation.y *= 0.85;
        lampGroup.rotation.z *= 0.85;

        if (Math.abs(lampGroup.rotation.x) < 0.01 &&
          Math.abs(lampGroup.rotation.y) < 0.01 &&
          Math.abs(lampGroup.rotation.z) < 0.01) {
          lampGroup.rotation.set(0, 0, 0);
          state.lampShaking = false;
          console.log('Lamp stopped shaking');

          // 세 번째 touch일 때만 모래바람 시작
          if (state.touchCount === 3) {
            console.log('🌪️ Starting sand storm!');
            state.isExploding = true;
            state.explosionStartTime = Date.now();
            // 화면 전환 시작으로 touch 상호작용 비활성화
            state.touchInteractionsEnabled = false;
            console.log('🚫 Touch interactions disabled due to screen transition');

            // touch 힌트는 자동으로 사라지므로 여기서 분산시키지 않음
          }
        }
      }
    }

    // 카메라 초기 위치로 복귀 (touch 3번 시)
    if (state.isCameraReturning) {
      const returnDuration = 2.0; // 2초에 걸쳐 복귀
      const returnElapsed = (Date.now() - state.cameraReturnStartTime) / 1000;
      const returnProgress = Math.min(returnElapsed / returnDuration, 1.0);

      // ease-in-out 함수
      const easeInOut = returnProgress < 0.5
        ? 2 * returnProgress * returnProgress
        : 1 - Math.pow(-2 * returnProgress + 2, 2) / 2;

      // 각도 차이 계산 (최단 경로로 회전)
      let angleDiff = state.cameraTargetAngle - state.cameraStartAngle;
      // -PI ~ PI 범위로 정규화
      while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
      while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

      cameraAngle = state.cameraStartAngle + angleDiff * easeInOut;
      updateCameraPosition();

      if (returnProgress >= 1.0) {
        state.isCameraReturning = false;
        console.log('📸 Camera returned to initial position');
      }
    }

    // 부드러운 카메라 회전 (ease in/out) - 키보드
    if (!state.isCameraReturning && (state.isRotatingLeft || state.isRotatingRight)) {
      // 가속
      if (state.isRotatingLeft) {
        state.rotationVelocity = Math.min(state.rotationVelocity + rotationAcceleration, maxRotationSpeed);
      } else if (state.isRotatingRight) {
        state.rotationVelocity = Math.max(state.rotationVelocity - rotationAcceleration, -maxRotationSpeed);
      }
    } else if (!state.isCameraReturning) {
      // 감속
      if (Math.abs(state.rotationVelocity) > 0.0001) {
        state.rotationVelocity *= (1 - rotationDeceleration * 10);
        if (Math.abs(state.rotationVelocity) < 0.0001) {
          state.rotationVelocity = 0;
        }
      }
    }

    // 회전 적용
    if (state.rotationVelocity !== 0) {
      cameraAngle += state.rotationVelocity;
      updateCameraPosition();
    }

    renderer.render(scene, camera);
  }

  animateThree();

  return {
    scene,
    camera,
    renderer,
    lights: {
      ambientLight,
      lampLight,
      mainLight
    },
    cameraAngle, // 이 값을 state에 동기화해야 함
    updateCameraAngle: (newAngle) => { cameraAngle = newAngle; }
  };
}
