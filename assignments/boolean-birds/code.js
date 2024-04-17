/*
 * Important facts about the birds of Booleana.
 *
 * Coloration and markings:
 *
 *   - Flobby Birds and Bloggy Birds are red.
 *   - Flibble Birds and Globby Birds are not red.
 *   - Flobby Birds and Flibble Birds are spotted.
 *   - Bloggy Birds and Globby Birds are not spotted.
 *
 * Diet:
 *
 *   - Flobby Birds eat fish, nuts, and worms.
 *   - Bloggy Birds eat mice, nuts, and worms.
 *   - Flibble Birds eat fish, mice, and worms.
 *   - Globby Birds eat fish, mice, and nuts.
 *
 */

const isFlobbyBird = (red, spotted) => (red && spotted)

const isBloggyBird = (red, spotted) => (red && !spotted)

const isFlibbleBird = (red, spotted) => (!red && spotted)

const isGlobbyBird = (red, spotted) => (!red && !spotted)

const eatsWorms = (red, spotted) => red || spotted

const eatsNuts = (red, spotted) => red || !spotted

const eatsFish = (red, spotted) => !red || spotted

const eatsMice = (red, spotted) => !red || !spotted

const isRed = (name) => name === 'Flobby' || name === 'Bloggy';

const isSpotted = (name) => name === 'Flobby' || name === 'Flibble';

const isNotRed = (name) => name === 'Globby' || name === 'Flibble';

const isNotSpotted = (name) => name === 'Bloggy' || name === 'Globby';