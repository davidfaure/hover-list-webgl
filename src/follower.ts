import gsap from "gsap";

const TOGGLE_DURATION = 0.8;
const TOGGLE_EASE = "expo";

export type SelectHandler = (
  index: number,
  forward: boolean,
  instant: boolean,
) => void;

export class Follower {
  readonly el: HTMLElement;
  readonly proxy: HTMLElement;
  private readonly onSelect: SelectHandler;
  private readonly xTo: gsap.QuickToFunc;
  private readonly yTo: gsap.QuickToFunc;
  private prevIndex: number | null = null;
  private firstEntry = true;

  constructor(list: HTMLElement, onSelect: SelectHandler) {
    this.onSelect = onSelect;

    this.el = document.createElement("div");
    this.el.className = "follower";

    this.proxy = document.createElement("div");
    this.proxy.className = "follower__inner";

    this.el.append(this.proxy);
    document.body.append(this.el);

    gsap.set(this.el, { xPercent: -50, yPercent: -50 });
    gsap.set(this.proxy, { opacity: 0, scale: 0.1 });

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
    gsap.to(this.proxy, {
      opacity: visible ? 1 : 0,
      scale: visible ? 1 : 0.1,
      duration: TOGGLE_DURATION,
      ease: TOGGLE_EASE,
      overwrite: true,
    });
  }

  private onListEnter = () => {
    this.toggle(true);
  };

  private onListLeave = () => {
    this.toggle(false);
    this.firstEntry = true;
    this.prevIndex = null;
  };

  private onItemEnter(index: number) {
    const forward = this.prevIndex === null || index > this.prevIndex;
    this.onSelect(index, forward, this.firstEntry);
    this.firstEntry = false;
    this.prevIndex = index;
  }
}
