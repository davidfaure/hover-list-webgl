import gsap from "gsap";
import * as THREE from "three";
import type { Follower } from "../follower";
import vertexShader from "./shaders/vertex.glsl?raw";
import fragmentShader from "./shaders/fragment.glsl?raw";

const DISTORTION = 0.0008;
const DISTORTION_LERP = 0.1;
const TRANSITION_CURVE = 0.15;
const TRANSITION_DURATION = 0.5;
const TRANSITION_EASE = "power2.inOut";

interface TextureEntry {
  texture: THREE.Texture;
  res: THREE.Vector2;
}

export class FollowerGL {
  private readonly follower: Follower;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1000, 1000);
  private readonly geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
  private readonly material: THREE.ShaderMaterial;
  private readonly mesh: THREE.Mesh;
  private readonly entries: TextureEntry[];
  private readonly size = new THREE.Vector2();
  private readonly mouse = new THREE.Vector2();
  private readonly offset = new THREE.Vector2();
  private prevIndex = 0;
  private nextIndex = 0;
  private transition: gsap.core.Tween | null = null;
  private wasVisible = false;

  constructor(follower: Follower, images: string[]) {
    this.follower = follower;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.domElement.className = "webgl";
    document.body.append(this.renderer.domElement);

    const loader = new THREE.TextureLoader();
    this.entries = images.map((src) => {
      const res = new THREE.Vector2(1, 1);
      const texture = loader.load(src, ({ image }) => {
        res.set(image.naturalWidth, image.naturalHeight);
      });
      texture.colorSpace = THREE.SRGBColorSpace;
      return { texture, res };
    });

    const first = this.entries[0];
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      premultipliedAlpha: true,
      uniforms: {
        uTexturePrev: { value: first?.texture },
        uTextureNext: { value: first?.texture },
        uPrevRes: { value: first?.res },
        uNextRes: { value: first?.res },
        uPlaneRes: { value: new THREE.Vector2(1, 1) },
        uProgress: { value: 1 },
        uDirection: { value: 1 },
        uAlpha: { value: 0 },
        uCurve: { value: TRANSITION_CURVE },
        uOffset: { value: this.offset },
      },
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);

    this.resize();
    window.addEventListener("resize", this.resize);
    window.addEventListener("mousemove", this.onMouseMove);
    gsap.ticker.add(this.render);
  }

  show(index: number, forward: boolean, instant: boolean) {
    const uniforms = this.material.uniforms;
    this.transition?.kill();

    const from = uniforms.uProgress!.value > 0.5 ? this.nextIndex : this.prevIndex;
    this.prevIndex = instant ? index : from;
    this.nextIndex = index;

    uniforms.uTexturePrev!.value = this.entries[this.prevIndex]?.texture;
    uniforms.uPrevRes!.value = this.entries[this.prevIndex]?.res;
    uniforms.uTextureNext!.value = this.entries[index]?.texture;
    uniforms.uNextRes!.value = this.entries[index]?.res;
    uniforms.uDirection!.value = forward ? 1 : -1;

    if (instant) {
      uniforms.uProgress!.value = 1;
      return;
    }

    uniforms.uProgress!.value = 0;
    this.transition = gsap.to(uniforms.uProgress!, {
      value: 1,
      duration: TRANSITION_DURATION,
      ease: TRANSITION_EASE,
    });
  }

  private onMouseMove = (e: MouseEvent) => {
    this.mouse.set(e.clientX, e.clientY);
  };

  private resize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.renderer.setSize(width, height);
    this.camera.left = -width / 2;
    this.camera.right = width / 2;
    this.camera.top = height / 2;
    this.camera.bottom = -height / 2;
    this.camera.updateProjectionMatrix();

    const rect = this.follower.el.getBoundingClientRect();
    this.size.set(rect.width, rect.height);
  };

  private render = () => {
    const { el, proxy } = this.follower;
    const alpha = Number(gsap.getProperty(proxy, "opacity"));

    if (alpha <= 0.001) {
      if (this.wasVisible) {
        this.renderer.clear();
        this.wasVisible = false;
      }
      return;
    }
    this.wasVisible = true;

    const centerX = Number(gsap.getProperty(el, "x"));
    const centerY = Number(gsap.getProperty(el, "y"));
    const scale = Number(gsap.getProperty(proxy, "scale"));
    const width = this.size.x * scale;
    const height = this.size.y * scale;

    this.mesh.position.set(
      centerX - window.innerWidth / 2,
      window.innerHeight / 2 - centerY,
      0,
    );
    this.mesh.scale.set(width, height, 1);

    const uniforms = this.material.uniforms;
    uniforms.uAlpha!.value = alpha;
    (uniforms.uPlaneRes!.value as THREE.Vector2).set(width, height);

    this.offset.x = gsap.utils.interpolate(
      this.offset.x,
      (this.mouse.x - centerX) * DISTORTION,
      DISTORTION_LERP,
    );
    this.offset.y = gsap.utils.interpolate(
      this.offset.y,
      -(this.mouse.y - centerY) * DISTORTION,
      DISTORTION_LERP,
    );

    this.renderer.render(this.scene, this.camera);
  };
}
