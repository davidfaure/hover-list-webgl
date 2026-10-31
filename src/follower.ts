import gsap from "gsap";

const VISUAL_OFFSET = 100;
const VISUAL_DURATION = 0.5;
const VISUAL_EASE = "power2.inOut";
const TOGGLE_DURATION = 0.8;
const TOGGLE_EASE = "expo";

export class Follower {
  private readonly el: HTMLElement;
  private readonly inner: HTMLElement;
  private readonly visuals: HTMLElement[];
  private readonly xTo: gsap.QuickToFunc;
  private readonly yTo: gsap.QuickToFunc;
  private prevIndex: number | null = null;
  private firstEntry = true;
  private resetCall: gsap.core.Tween | null = null;

  constructor(list: HTMLElement, images: string[]) {
    this.el = document.createElement("div");
    this.el.className = "follower";

    this.inner = document.createElement("div");
    this.inner.className = "follower__inner";

    this.visuals = images.map((src) => {
      const visual = document.createElement("div");
      visual.className = "follower__visual";
      visual.innerHTML = `<img src="${src}" alt="" />`;
      return visual;
    });

    this.inner.append(...this.visuals);
    this.el.append(this.inner);
    document.body.append(this.el);

    gsap.set(this.el, { xPercent: -50, yPercent: -50 });
    gsap.set(this.inner, { opacity: 0, scale: 0.1 });
    gsap.set(this.visuals, { yPercent: VISUAL_OFFSET });

    this.xTo = gsap.quickTo(this.el, "x", { duration: 0.6, ease: "power3" });
    this.yTo = gsap.quickTo(this.el, "y", { duration: 0.6, ease: "power3" });

    window.addEventListener("mousemove", this.onMouseMove);
    list.addEventListener("mouseenter", this.onListEnter);
    list.addEventListener("mouseleave", this.onListLeave);
    [...list.children].forEach((item, index) => {
      item.addEventListener("mouseenter", () => this.onItemEnter(index));
    });
  }

  private onMouseMove = (e: MouseEvent) => {
    this.xTo(e.clientX);
    this.yTo(e.clientY);
  };

  private toggle(visible: boolean) {
    gsap.to(this.inner, {
      opacity: visible ? 1 : 0,
      scale: visible ? 1 : 0.1,
      duration: TOGGLE_DURATION,
      ease: TOGGLE_EASE,
      overwrite: true,
    });
  }

  private onListEnter = () => {
    this.resetCall?.kill();
    this.toggle(true);
  };

  private onListLeave = () => {
    this.toggle(false);
    this.firstEntry = true;
    this.prevIndex = null;
    this.resetCall?.kill();
    this.resetCall = gsap.delayedCall(TOGGLE_DURATION, () => {
      gsap.killTweensOf(this.visuals);
      gsap.set(this.visuals, { yPercent: VISUAL_OFFSET });
    });
  };

  private onItemEnter(index: number) {
    const forward = this.prevIndex === null || index > this.prevIndex;
    const prev = this.prevIndex !== null ? this.visuals[this.prevIndex] : null;
    const next = this.visuals[index];
    this.prevIndex = index;

    if (prev && prev !== next) {
      gsap.to(prev, {
        yPercent: forward ? -VISUAL_OFFSET : VISUAL_OFFSET,
        duration: VISUAL_DURATION,
        ease: VISUAL_EASE,
        overwrite: true,
      });
    }

    if (!next) return;

    if (this.firstEntry) {
      this.firstEntry = false;
      gsap.set(next, { yPercent: 0, overwrite: true });
      return;
    }

    gsap.fromTo(
      next,
      { yPercent: forward ? VISUAL_OFFSET : -VISUAL_OFFSET },
      {
        yPercent: 0,
        duration: VISUAL_DURATION,
        ease: VISUAL_EASE,
        overwrite: true,
      },
    );
  }
}
