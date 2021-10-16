export type RandomState = [number, number, number, number];

export class Random {
  private sequence0: number;
  private sequence1: number;
  private sequence2: number;
  private correction: number;

  constructor(...seeds: any[]) {
    this.sequence0 = 0;
    this.sequence1 = 0;
    this.sequence2 = 0;
    this.correction = 1;

    seeds = seeds.filter((seed) => seed !== null && seed !== undefined);

    if (seeds.length == 0) {
      seeds = [Math.random()];
    }
    const mash = makeMash();

    this.sequence0 = mash(" ");
    this.sequence1 = mash(" ");
    this.sequence2 = mash(" ");

    for (const seed of seeds) {
      if (!seed) {
        continue;
      }
      this.sequence0 -= mash(seed);
      if (this.sequence0 < 0) {
        this.sequence0 += 1;
      }
      this.sequence1 -= mash(seed);
      if (this.sequence1 < 0) {
        this.sequence1 += 1;
      }
      this.sequence2 -= mash(seed);
      if (this.sequence2 < 0) {
        this.sequence2 += 1;
      }
    }
  }

  static fromState(state: RandomState) {
    const random = new Random();
    random.importState(state);
    return random;
  }

  next() {
    const term =
      2091639 * this.sequence0 + this.correction * 2.3283064365386963e-10; // 2^-32
    this.sequence0 = this.sequence1;
    this.sequence1 = this.sequence2;
    this.correction = term | 0;
    this.sequence2 = term - this.correction;
    return this.sequence2;
  }

  uint32() {
    return this.next() * 0x100000000; // 2^32
  }

  fract53() {
    return (
      this.next() + ((this.next() * 0x200000) | 0) * 1.1102230246251565e-16
    ); // 2^-53
  }

  getState() {
    return [
      this.sequence0,
      this.sequence1,
      this.sequence2,
      this.correction,
    ] as RandomState;
  }

  private importState(state: RandomState) {
    this.sequence0 = +state[0] || 0;
    this.sequence1 = +state[1] || 0;
    this.sequence2 = +state[2] || 0;
    this.correction = +state[3] || 0;
  }
}

const makeMash = () => {
  let n = 0xefc8249d;

  return (data: number | string) => {
    data = data.toString();
    for (let i = 0; i < data.length; i++) {
      n += data.charCodeAt(i);
      var h = 0.02519603282416938 * n;
      n = h >>> 0;
      h -= n;
      h *= n;
      n = h >>> 0;
      h -= n;
      n += h * 0x100000000; // 2^32
    }
    return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
  };
};
