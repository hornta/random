import { Random } from "./random";

const generate100Numbers = (generator: Random) => {
  const numbers: number[] = [];
  for (let i = 0; i < 100; ++i) {
    numbers.push(generator.next());
  }
  return numbers;
};

test("given the same seed, two generators should yield the exact same numbers", () => {
  const seed = Math.random();
  const generator = new Random(seed);
  const otherGenerator = new Random(seed);
  const numbers = generate100Numbers(generator);
  const otherNumbers = generate100Numbers(otherGenerator);

  expect(numbers).toEqual(otherNumbers);
});

test("when not given a seed, each generator should use a random seed", () => {
  const generator = new Random();
  const otherGenerator = new Random();
  const numbers = generate100Numbers(generator);
  const otherNumbers = generate100Numbers(otherGenerator);

  expect(numbers).not.toEqual(otherNumbers);
});

test("generator can be started from a state", () => {
  const generator = new Random();
  generate100Numbers(generator);
  const state = generator.getState();
  const otherGenerator = Random.fromState(state);
  const numbers = generate100Numbers(generator);
  const otherNumbers = generate100Numbers(otherGenerator);

  expect(numbers).toEqual(otherNumbers);
});
