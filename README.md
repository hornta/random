# Random

Pseudo random number generator which can be seeded and restarted from a random state.

## Install

```
npm install @hornta/random
```

## Usage

```ts
import { Random } from "@hornta/random";

const generator = new Random("seed");
generator.next();
```
