
import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { PlayerState, StarSystem, DestinationType } from '../../types'; // Added DestinationType
import { FACTION_COLORS, ANOMALY_SCAN_COST_CREDITS, ALL_FACTIONS_DATA } from '../../constants';
import { Icons } from '../../icons';
import LoadingSpinner from '../LoadingSpinner';

// Helper to convert Tailwind color class to HEX
const tailwindColorToHex = (twColor: string | undefined): string => {
    if (!twColor) return '#888888'; // Default gray

    const colorMap: Record<string, string> = {
        'red-700': '#B91C1C', 'red-600': '#DC2626', 'red-500': '#EF4444',
        'orange-700': '#C2410C', 'orange-600': '#EA580C', 'orange-500': '#F97316', 'orange-400': '#FB923C',
        'yellow-600': '#CA8A04', 'yellow-500': '#EAB308', 'yellow-400': '#FACC15',
        'green-700': '#15803D', 'green-600': '#16A34A', 'green-500': '#22C55E', 'green-400': '#4ADE80',
        'teal-700': '#0F766E', 'teal-600': '#0D9488', 'teal-500': '#14B8A6',
        'blue-700': '#1D4ED8', 'blue-600': '#2563EB', 'blue-500': '#3B82F6', 'blue-400': '#60A5FA',
        'sky-300': '#7DD3FC',
        'indigo-700': '#3730A3','indigo-600':'#4F46E5', 'indigo-500':'#6366F1', 'indigo-400': '#818CF8',
        'purple-700': '#6B21A8', 'purple-600': '#7E22CE', 'purple-500': '#A855F7', 'purple-400': '#C084FC',
        'pink-800': '#831843', 'pink-700': '#9D174D', 'pink-600': '#DB2777', 'pink-400': '#F472B6',
        'gray-600': '#4B5563', 'gray-500': '#6B7280', 'gray-400': '#9CA3BA',
        'slate-200': '#E2E8F0',
    };
    const parts = twColor.split(' ');
    for (const part of parts) {
        if (part.startsWith('bg-') && colorMap[part.substring(3)]) {
            return colorMap[part.substring(3)];
        }
        if (colorMap[part]) return colorMap[part];
    }
    const colorNameMatch = twColor.match(/(red|orange|yellow|green|teal|blue|indigo|purple|pink|gray|slate)-(\d+)/);
    if (colorNameMatch && colorNameMatch[1] && colorNameMatch[2]) {
        const simplifiedTwClass = `${colorNameMatch[1]}-${colorNameMatch[2]}`;
        if (colorMap[simplifiedTwClass]) return colorMap[simplifiedTwClass];
    }
    return '#888888';
};

const GALAXY_RADIUS_SCALE = 1.2;
const SYSTEM_BASE_SIZE = 0.3;
const SYSTEM_SIZE_MODIFIER_IMPORTANT = 0.2;
const SYSTEM_SIZE_MODIFIER_CAPITAL = 0.4;

interface TooltipData {
  text: string;
  x: number;
  y: number;
}

interface GalaxyViewProps {
  playerState: PlayerState | null;
  starSystems: StarSystem[];
  onOpenSystemInfo: (system: StarSystem) => void;
  onScanForAnomalies: () => void;
  isLoading: boolean;
  showNotification: (message: string) => void;
  onTravelToSystem: (destinationId: string, destinationType: DestinationType) => void;
}

const GalaxyView3D: React.FC<GalaxyViewProps> = ({
  playerState,
  starSystems,
  onOpenSystemInfo,
  onScanForAnomalies,
  isLoading: appIsLoading,
  showNotification,
  onTravelToSystem,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const systemsGroupRef = useRef<THREE.Group | null>(null);
  const starsGroupRef = useRef<THREE.Points | null>(null);
  // frameIdRef is removed as animation loop ID is managed locally in useEffect

  const [selectedSystem3D, setSelectedSystem3D] = useState<StarSystem | null>(null);
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const hasDraggedRef = useRef(false); 

  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const mouse = useMemo(() => new THREE.Vector2(), []);

  const handleSystemClick = useCallback((systemData: StarSystem) => {
    setSelectedSystem3D(systemData);
  }, []);


  useEffect(() => {
    if (!mountRef.current || !playerState) return;

    const currentMount = mountRef.current;

    sceneRef.current = new THREE.Scene();
    sceneRef.current.background = new THREE.Color(0x080a14);

    cameraRef.current = new THREE.PerspectiveCamera(
      60,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      2000
    );
    cameraRef.current.position.set(0, 60, 80);
    cameraRef.current.lookAt(0,0,0);
    
    rendererRef.current = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current.setSize(currentMount.clientWidth, currentMount.clientHeight);
    rendererRef.current.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(rendererRef.current.domElement);

    const ambientLight = new THREE.AmbientLight(0x606080, 1);
    sceneRef.current.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1).normalize();
    sceneRef.current.add(directionalLight);
    const pointLight = new THREE.PointLight(0xffffff, 0.5, 300);
    pointLight.position.set(0, 20, 0);
    sceneRef.current.add(pointLight);

    const starsVertices = [];
    for (let i = 0; i < 5000; i++) {
      starsVertices.push(
        THREE.MathUtils.randFloatSpread(1000),
        THREE.MathUtils.randFloatSpread(600),
        THREE.MathUtils.randFloatSpread(1000)
      );
    }
    const starsGeometry = new THREE.BufferGeometry();
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const starsMaterial = new THREE.PointsMaterial({ color: 0xBBBBFF, size: 0.3, transparent: true, opacity: 0.7 });
    starsGroupRef.current = new THREE.Points(starsGeometry, starsMaterial);
    sceneRef.current.add(starsGroupRef.current);

    systemsGroupRef.current = new THREE.Group();
    starSystems.forEach(system => {
      const systemSize = SYSTEM_BASE_SIZE +
        (system.iconType === 'important' ? SYSTEM_SIZE_MODIFIER_IMPORTANT : 0) +
        (system.iconType === 'capital' ? SYSTEM_SIZE_MODIFIER_CAPITAL : 0);

      const starColorHex = tailwindColorToHex(system.starColorCss || FACTION_COLORS[system.faction]?.split(' ')[0]);
      const starMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(starColorHex),
        emissive: new THREE.Color(starColorHex),
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.9
      });

      const starGeometry = new THREE.SphereGeometry(systemSize, 16, 16);
      const starMesh = new THREE.Mesh(starGeometry, starMaterial);

      starMesh.position.set(
        (system.position.x - 50) * GALAXY_RADIUS_SCALE,
        THREE.MathUtils.randFloat(-5, 5),
        (system.position.y - 50) * GALAXY_RADIUS_SCALE
      );
      starMesh.userData = { type: 'system', systemData: system, originalColor: starMaterial.color.clone() };
      systemsGroupRef.current.add(starMesh);

      const glowMaterial = new THREE.SpriteMaterial({
          map: new THREE.CanvasTexture(generateGlowTexture(starColorHex)),
          color: starColorHex,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
      });
      const glowSprite = new THREE.Sprite(glowMaterial);
      glowSprite.scale.set(systemSize * 5, systemSize * 5, 1);
      starMesh.add(glowSprite);
    });
    sceneRef.current.add(systemsGroupRef.current);
    
    const handleResize = () => {
        if (mountRef.current && cameraRef.current && rendererRef.current && sceneRef.current) {
            cameraRef.current.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call

    let clickTimeout: number | null = null;
    const onCanvasMouseDown = (event: MouseEvent) => {
      isDraggingRef.current = true;
      hasDraggedRef.current = false; 
      previousMousePositionRef.current = { x: event.clientX, y: event.clientY };
    };

    const onCanvasMouseUp = (event: MouseEvent) => {
        isDraggingRef.current = false;
        if (clickTimeout) clearTimeout(clickTimeout);

        if (!hasDraggedRef.current) { 
            clickTimeout = window.setTimeout(() => { 
                if (!rendererRef.current || !cameraRef.current || !systemsGroupRef.current) return;
                const rect = rendererRef.current.domElement.getBoundingClientRect();
                mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
                raycaster.setFromCamera(mouse, cameraRef.current);
                const intersects = raycaster.intersectObjects(systemsGroupRef.current.children.filter(c => c instanceof THREE.Mesh));

                if (intersects.length > 0 && intersects[0].object.userData.type === 'system') {
                    handleSystemClick(intersects[0].object.userData.systemData);
                } else {
                    setSelectedSystem3D(null);
                }
            }, 50);
        }
    };

    const onCanvasMouseMove = (event: MouseEvent) => {
      if (isDraggingRef.current && cameraRef.current && systemsGroupRef.current) {
        hasDraggedRef.current = true; 
        const deltaMove = {
          x: event.clientX - previousMousePositionRef.current.x,
          y: event.clientY - previousMousePositionRef.current.y,
        };

        const deltaRotationQuaternion = new THREE.Quaternion()
            .setFromEuler(new THREE.Euler(
                THREE.MathUtils.degToRad(deltaMove.y * 0.2),
                THREE.MathUtils.degToRad(deltaMove.x * 0.2),
                0,
                'XYZ'
            ));
        cameraRef.current.position.applyQuaternion(deltaRotationQuaternion);
        cameraRef.current.up.applyQuaternion(deltaRotationQuaternion);
        cameraRef.current.lookAt(systemsGroupRef.current.position);

        previousMousePositionRef.current = { x: event.clientX, y: event.clientY };
        setTooltipData(null); 
      } else if (!isDraggingRef.current && rendererRef.current && cameraRef.current && systemsGroupRef.current && playerState) {
        const rect = rendererRef.current.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, cameraRef.current);
        const intersects = raycaster.intersectObjects(systemsGroupRef.current.children.filter(c => c instanceof THREE.Mesh));

        systemsGroupRef.current.children.forEach(child => {
            if (child instanceof THREE.Mesh && child.userData.type === 'system') {
                (child.material as THREE.MeshPhongMaterial).color.copy(child.userData.originalColor);
            }
        });

        if (intersects.length > 0 && intersects[0].object.userData.type === 'system') {
          const intersectedObject = intersects[0].object as THREE.Mesh;
          const systemData = intersectedObject.userData.systemData as StarSystem;
          (intersectedObject.material as THREE.MeshPhongMaterial).color.setHex(0xffffff); 
          const isKnown = playerState.knownSystemIds.includes(systemData.id);
          const tooltipText = isKnown ? systemData.name : "Sistema Desconhecido";
          const vector = new THREE.Vector3();
          intersectedObject.getWorldPosition(vector);
          vector.project(cameraRef.current);
          const x = (vector.x *  .5 + .5) * currentMount.clientWidth;
          const y = (vector.y * -.5 + .5) * currentMount.clientHeight;
          setTooltipData({ text: tooltipText, x, y });
        } else {
          setTooltipData(null);
        }
      }
    };

    const onCanvasMouseLeave = () => {
        setTooltipData(null); 
        isDraggingRef.current = false; 
    };

    const onCanvasWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (cameraRef.current) {
        const zoomSpeed = 0.1;
        const newDistance = cameraRef.current.position.length() * (1 - event.deltaY * zoomSpeed * 0.01);
        const clampedDistance = Math.max(20, Math.min(250, newDistance));
        cameraRef.current.position.setLength(clampedDistance);
      }
    };

    currentMount.addEventListener('mousedown', onCanvasMouseDown);
    currentMount.addEventListener('mouseup', onCanvasMouseUp);
    currentMount.addEventListener('mousemove', onCanvasMouseMove);
    currentMount.addEventListener('mouseleave', onCanvasMouseLeave);
    currentMount.addEventListener('wheel', onCanvasWheel, { passive: false });

    let animationLoopId: number | null = null;
    const animate = () => {
      animationLoopId = requestAnimationFrame(animate);
      if (starsGroupRef.current) {
        starsGroupRef.current.rotation.y += 0.0001;
        starsGroupRef.current.rotation.x += 0.00005;
      }
      if (systemsGroupRef.current && playerState?.currentSystemId && cameraRef.current) {
        systemsGroupRef.current.children.forEach(child => {
            if (child instanceof THREE.Mesh && child.userData.type === 'system') {
                const systemData = child.userData.systemData as StarSystem;
                const isCurrent = systemData.id === playerState.currentSystemId;
                const isSelected3DCurrent = selectedSystem3D?.id === systemData.id;
                const starMaterial = child.material as THREE.MeshPhongMaterial;
                if (isCurrent) {
                    starMaterial.emissiveIntensity = 0.8 + Math.sin(Date.now() * 0.005) * 0.2;
                } else if (isSelected3DCurrent) {
                    starMaterial.emissiveIntensity = 0.6;
                } else {
                    starMaterial.emissiveIntensity = 0.3;
                }
            }
        });
      }
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    
    const initialRenderSetupFrameId = requestAnimationFrame(() => {
        if (rendererRef.current && sceneRef.current && cameraRef.current && mountRef.current) {
            handleResize(); // Ensure dimensions are correct before first render
            rendererRef.current.render(sceneRef.current, cameraRef.current); // Render the first frame
            animate(); // Then start the continuous animation loop
        }
    });


    return () => {
      if (initialRenderSetupFrameId) cancelAnimationFrame(initialRenderSetupFrameId);
      if (animationLoopId) cancelAnimationFrame(animationLoopId);
      
      currentMount.removeEventListener('mousedown', onCanvasMouseDown);
      currentMount.removeEventListener('mouseup', onCanvasMouseUp);
      currentMount.removeEventListener('mousemove', onCanvasMouseMove);
      currentMount.removeEventListener('mouseleave', onCanvasMouseLeave);
      currentMount.removeEventListener('wheel', onCanvasWheel);
      window.removeEventListener('resize', handleResize);
      if (clickTimeout) clearTimeout(clickTimeout);

      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (rendererRef.current.domElement.parentNode === currentMount) {
          currentMount.removeChild(rendererRef.current.domElement);
        }
      }
      if (sceneRef.current) {
        sceneRef.current.traverse(object => {
            if (object instanceof THREE.Mesh || object instanceof THREE.Sprite || object instanceof THREE.Points) {
                if (object.geometry) object.geometry.dispose();
                if (object.material) {
                    const material = object.material as THREE.Material | THREE.Material[];
                    if (Array.isArray(material)) {
                        material.forEach(mat => {
                             if (mat.map) mat.map.dispose();
                             mat.dispose();
                        });
                    } else {
                        if (material.map) material.map.dispose();
                        material.dispose();
                    }
                }
            }
        });
      }
      // No need to dispose starsGeometry and starsMaterial here as they are local to the effect
      // and will be GC'd if the scene is properly cleaned up.
      // However, if they were useRefs themselves, they'd need disposal if re-created.
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [starSystems, playerState?.currentSystemId, playerState?.knownSystemIds, handleSystemClick, mouse, raycaster, playerState]); // Added playerState to ensure effect re-runs if playerState itself changes (e.g., from null to object)

  const resetCameraView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 60, 80);
      cameraRef.current.lookAt(0, 0, 0);
    }
  };

  const focusOnSelectedSystem = () => {
    if (selectedSystem3D && cameraRef.current && systemsGroupRef.current) {
      const systemMesh = systemsGroupRef.current.children.find(
        child => (child as THREE.Mesh).userData?.systemData?.id === selectedSystem3D.id
      ) as THREE.Mesh | undefined;

      if (systemMesh) {
        const targetPosition = new THREE.Vector3();
        systemMesh.getWorldPosition(targetPosition);
        const offset = new THREE.Vector3(0, 10, 20); 
        const cameraPosition = new THREE.Vector3().addVectors(targetPosition, offset);
        cameraRef.current.position.copy(cameraPosition);
        cameraRef.current.lookAt(targetPosition);
      }
    }
  };

  function generateGlowTexture(colorHex: string) {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext('2d')!;
    const gradient = context.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 2
    );
    gradient.addColorStop(0, colorHex); 
    gradient.addColorStop(0.5, colorHex + 'aa'); 
    gradient.addColorStop(1, colorHex + '00'); 
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    return canvas;
  }

  const currentSystemName = playerState?.currentSystemId && playerState.knownSystemIds.includes(playerState.currentSystemId)
    ? (starSystems.find(s => s.id === playerState.currentSystemId)?.name || 'Desconhecido')
    : 'Sistema Desconhecido';

  if (appIsLoading && !playerState) return <LoadingSpinner message="Carregando dados da galáxia..." />;

  return (
    <div className="flex-1 flex flex-col bg-scifi-dark rounded-xl relative overflow-hidden shadow-2xl border border-sky-500/10">
       <div className="absolute top-0 left-0 right-0 p-4 bg-slate-950/40 backdrop-blur-md z-20 flex justify-between items-center border-b border-sky-500/10">
        <h2 className="text-xl font-display font-semibold text-sky-400 tracking-wider flex items-center">
          <div className="w-5 h-5 mr-3 text-sky-500"><Icons.Galaxy /></div>
          MAPA ESTELAR 3D
        </h2>
        {playerState?.currentSystemId && (
          <div className="bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full flex items-center">
            <span className="text-[10px] text-sky-400 uppercase tracking-widest mr-2 opacity-70">Sistema Atual:</span>
            <span className="text-xs font-display font-bold text-sky-200">{currentSystemName}</span>
          </div>
        )}
      </div>

      <div ref={mountRef} className="flex-grow w-full h-full cursor-move" />

      {tooltipData && (
        <div
          className="absolute bg-slate-900/90 text-sky-100 text-[10px] uppercase tracking-widest px-3 py-2 rounded-lg shadow-xl pointer-events-none backdrop-blur-md border border-sky-500/30 whitespace-nowrap z-30"
          style={{
            left: `${tooltipData.x}px`,
            top: `${tooltipData.y}px`,
            transform: 'translate(15px, -25px)', 
          }}
        >
          {tooltipData.text}
        </div>
      )}

      <div className="absolute top-2 md:top-4 left-2 md:left-4 p-2 md:p-4 glass-panel rounded-lg md:rounded-xl shadow-2xl z-20 space-y-3 md:space-y-4 max-w-[140px] md:max-w-[180px] max-h-[calc(100%-1rem)] md:max-h-[calc(100%-2rem)] overflow-y-auto custom-scrollbar border-sky-500/30">
        <h3 className="text-[10px] md:text-xs font-display font-semibold text-sky-300 border-b border-sky-500/20 pb-1 md:pb-2 mb-1 md:mb-2 uppercase tracking-tight flex items-center justify-between">
          <span>Comandos</span>
          <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></div>
        </h3>
        <div className="space-y-1 md:space-y-2 text-[8px] md:text-[10px] text-slate-300 font-technical opacity-70 uppercase tracking-tighter">
          <p className="flex items-center"><span className="w-2.5 h-2.5 md:w-3 md:h-3 mr-1.5 md:mr-2 text-sky-400">🖱️</span> Arrastar</p>
          <p className="flex items-center"><span className="w-2.5 h-2.5 md:w-3 md:h-3 mr-1.5 md:mr-2 text-sky-400">🎡</span> Zoom</p>
          <p className="flex items-center"><span className="w-2.5 h-2.5 md:w-3 md:h-3 mr-1.5 md:mr-2 text-sky-400">👆</span> Selecionar</p>
        </div>
        <div className="pt-1 flex flex-col gap-1.5 md:gap-2">
          <button
            onClick={resetCameraView}
            className="btn-scifi py-1.5 md:py-2 text-[8px] md:text-[10px] border-slate-700 text-slate-400 hover:text-slate-100"
          >
            Resetar
          </button>
          <button
              onClick={onScanForAnomalies}
              className="btn-scifi py-1.5 md:py-2 text-[8px] md:text-[10px] bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/30 hover:text-purple-100 flex items-center justify-center"
              disabled={playerState?.isTraveling || appIsLoading}
              title={`Procurar Anomalias (${ANOMALY_SCAN_COST_CREDITS} CR)`}
          >
              ANOMALIAS
          </button>
        </div>
      </div>

      {selectedSystem3D && playerState && (
        <div className="absolute top-2 md:top-4 right-2 md:right-4 p-3 md:p-5 glass-panel rounded-lg md:rounded-xl shadow-2xl z-20 space-y-3 md:space-y-4 w-[240px] md:w-[320px] max-h-[calc(100%-1rem)] md:max-h-[calc(100%-2rem)] overflow-y-auto custom-scrollbar border-sky-500/30">
          <div className="flex justify-between items-start border-b border-sky-500/20 pb-2 md:pb-3 mb-1 md:mb-2 text-right">
            <div className="flex-1">
              <span className="text-[8px] md:text-[10px] uppercase font-technical text-sky-500/70 tracking-widest block mb-0.5">Sistema Estelar</span>
              <h3 className="text-sm md:text-xl font-display font-bold text-amber-300 tracking-wide truncate" title={selectedSystem3D.name}>
                {playerState.knownSystemIds.includes(selectedSystem3D.id) ? selectedSystem3D.name : "Desconhecido"}
              </h3>
            </div>
            <button 
              onClick={() => setSelectedSystem3D(null)} 
              className="text-slate-500 hover:text-slate-100 transition-colors p-1 ml-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-2 md:space-y-3 text-right">
            {playerState.knownSystemIds.includes(selectedSystem3D.id) ? (
              <>
                <div className="grid grid-cols-2 gap-1.5 md:gap-2 text-[8px] md:text-[10px]">
                  <div className="bg-slate-800/40 p-1.5 md:p-2 rounded-lg border border-slate-700/50">
                    <span className="text-slate-500 uppercase font-technical block mb-0.5 md:mb-1 text-left">Facção</span>
                    <span className="text-slate-100 font-medium">
                      {ALL_FACTIONS_DATA.find(f => f.id === selectedSystem3D.faction)?.name || selectedSystem3D.faction}
                    </span>
                  </div>
                  <div className="bg-slate-800/40 p-1.5 md:p-2 rounded-lg border border-slate-700/50">
                    <span className="text-slate-500 uppercase font-technical block mb-0.5 md:mb-1 text-left">Status</span>
                    <span className="text-slate-100 font-medium capitalize">{selectedSystem3D.iconType}</span>
                  </div>
                </div>
                <div className="bg-slate-800/40 p-2 md:p-3 rounded-lg border border-slate-700/50 text-left">
                  <span className="text-slate-500 uppercase font-technical block mb-0.5 md:mb-1 text-[8px] md:text-[10px]">Descrição</span>
                  <p className="text-[9px] md:text-[11px] text-slate-300 leading-relaxed italic line-clamp-3 md:line-clamp-none">
                    "{selectedSystem3D.description}"
                  </p>
                </div>
              </>
            ) : (
              <div className="bg-red-950/20 p-3 md:p-4 rounded-lg border border-red-500/20 text-center">
                <p className="text-[8px] md:text-[10px] italic text-red-400 font-technical uppercase tracking-tight">
                  Sinal bloqueado. Escaneie para dados.
                </p>
              </div>
            )}
          </div>

          <div className="pt-1 flex flex-col gap-1.5 md:gap-2">
            <button
              onClick={focusOnSelectedSystem}
              className="btn-scifi py-1.5 md:py-2.5 text-[10px] md:text-xs border-sky-500/20"
            >
              Focar
            </button>
            <button
              onClick={() => onOpenSystemInfo(selectedSystem3D)}
              className="btn-scifi btn-scifi-primary py-1.5 md:py-2.5 text-[10px] md:text-xs"
              disabled={!playerState.knownSystemIds.includes(selectedSystem3D.id)}
            >
              Explorar
            </button>
            <button
              onClick={() => onTravelToSystem(selectedSystem3D.id, 'system')}
              className="btn-scifi py-1.5 md:py-2.5 text-[10px] md:text-xs bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 hover:text-emerald-100"
              disabled={
                playerState.isTraveling ||
                appIsLoading ||
                playerState.currentSystemId === selectedSystem3D.id 
              }
            >
              Saltar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalaxyView3D;
