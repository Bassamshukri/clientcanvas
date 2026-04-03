export class SpringValue {
  constructor(initialValue, stiffness = 160, damping = 18) {
    this.value = initialValue;
    this.target = initialValue;
    this.velocity = 0;
    this.stiffness = stiffness;
    this.damping = damping;
  }

  setTarget(t) {
    this.target = t;
  }

  step(dt) {
    const force = (this.target - this.value) * this.stiffness;
    this.velocity += force * dt;
    this.velocity *= Math.exp(-this.damping * dt);
    this.value += this.velocity * dt;
  }
}

export class SpringVec2 {
  constructor(x, y, stiffness = 160, damping = 18) {
    this.x = new SpringValue(x, stiffness, damping);
    this.y = new SpringValue(y, stiffness, damping);
  }

  get value() {
    return { x: this.x.value, y: this.y.value };
  }

  setTarget(tx, ty) {
    this.x.setTarget(tx);
    this.y.setTarget(ty);
  }

  step(dt) {
    this.x.step(dt);
    this.y.step(dt);
  }
}

export class Particle {
  constructor() {
    this.reset();
  }

  reset(w = 1080, h = 1920) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.vx = (Math.random() - 0.5) * 50;
    this.vy = (Math.random() - 0.5) * 50;
    this.life = 1.0;
    this.decay = 0.05 + Math.random() * 0.1;
    this.size = 1 + Math.random() * 3;
    this.color = "rgba(255,255,255,0.5)";
  }

  update(dt, w, h) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.life -= this.decay * dt;

    if (this.life <= 0) {
      this.reset(w, h);
    }
  }
}
