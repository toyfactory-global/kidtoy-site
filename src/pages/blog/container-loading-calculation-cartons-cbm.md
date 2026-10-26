---
layout: ../../layouts/BlogLayout.astro
title: "Container Loading for Toys: How Many Cartons Fit in a 20GP, 40GP or 40HQ"
description: "Nominal container volume is not usable volume. A realistic planning figure, the carton maths for a real toy SKU, and why weight rather than space limits some toy shipments."
date: "2026-10-22"
related:
  - wholesale-dinosaur-egg-bubble-machine-toy-automatic-electric-bubble-blower-with-dynamic-music-cool-led-lights-for-kids-outdoor-play
  - diy-kids-makeup-craft-box-with-electric-nail-grinder
---

**Short answer:** plan on roughly **28 CBM for a 20GP, 58 CBM for a 40GP and 68 CBM for a 40HQ** — not the nominal 33 / 67 / 76 CBM in the spec sheet. The gap is lost to carton corners, stacking gaps, door clearance and the fact that cartons do not tessellate perfectly.

That single correction is the difference between a loading plan that fits and a container that ships half-empty.

## Nominal versus usable volume

| Container | Nominal internal volume | Practical planning figure | Max payload (typical) |
|---|---|---|---|
| 20GP | ~33 CBM | **28 CBM** | ~28,000 kg |
| 40GP | ~67 CBM | **58 CBM** | ~26,000 kg |
| 40HQ | ~76 CBM | **68 CBM** | ~26,000 kg |

Two adjustments sit behind the middle column:

- **Carton inefficiency.** Rectangular cartons leave voids at the walls, under the roof curve and around the door frame. A 85–90% fill rate is realistic for uniform cartons; mixed carton sizes drop to 80% or lower.
- **Palletisation.** If your buyer requires pallets, expect another 10–15% loss to pallet footprint and the gaps between them. Palletised loads are volume-hungry and rarely worth it unless the destination requires them.

## The calculation, in order

```
1. Cartons per container = usable CBM ÷ CBM per carton
2. Units per container  = cartons x units per carton
3. Check weight         = cartons x gross weight per carton  (must be under payload)
4. The binding constraint is whichever limit you hit first
```

Step 3 is the one people skip, and it is the one that matters for dense products.

## Worked example: bubble machines

Using the real carton data for our S216414 dinosaur egg bubble machine:

| Field | Value |
|---|---|
| Units per carton | 72 pcs |
| Carton size | 84.5 × 43 × 70 cm |
| Volume per carton | 0.254 CBM |
| Gross weight | 29.4 kg |

**20GP:**

- 28 ÷ 0.254 = **110 cartons**
- 110 × 72 = **7,920 pcs**
- 110 × 29.4 = **3,234 kg** — far under the payload

Volume is the constraint here. This is a light, bulky product, so you fill the box long before you approach the weight limit.

**40HQ:**

- 68 ÷ 0.254 = **267 cartons**
- 267 × 72 = **19,224 pcs**
- 267 × 29.4 = **7,850 kg** — still volume-limited

That is the typical pattern for bubble toys, plush and large-format plastic: **you run out of space, not weight.**

## When weight becomes the constraint

The reverse happens with dense small items — building block sets, die-cast vehicles, liquid-filled products, anything with batteries.

Take a compact craft kit packed 24 to a carton at a small CBM. The volume maths will tell you a 40HQ holds several hundred cartons, but the gross weight per carton can be high enough that the payload limit is reached first, at which point you are paying for a container you cannot fill.

**Rule of thumb:** if your product's density is above roughly 300 kg per CBM, check the weight limit before you plan the volume. Below that, volume will bind first.

## Where toy shipments lose money

**1. Planning on nominal CBM.** A quotation built on 76 CBM for a 40HQ over-promises by roughly 10%. Your buyer plans a promotion around 21,000 units and receives 19,000.

**2. Ignoring carton orientation.** A carton that is 84.5 cm long will not turn inside a 2.35 m wide container in every direction. If the carton has a "this way up" constraint, you lose the ability to rotate it and the fill rate drops further.

**3. Mixing SKUs into one container.** Mixed loads are normal for a first order, but each SKU's cartons do not stack perfectly against another's. Budget 5–10% loss on a mixed container and confirm the loading plan with the factory before the cut-off date.

**4. Forgetting the last carton.** Cartons per container must be a whole number. 110.2 cartons is 110 cartons. Rounding up on paper is how a loading plan fails at the warehouse.

## What to ask the factory

Before you book freight, request this in one message:

> Carton dimensions (L × W × H), units per carton, gross and net weight per carton, total carton count for my order quantity, and total CBM.

From those six numbers you can build the loading plan yourself and cross-check any quote you receive. If a supplier cannot give you carton dimensions before you order, they are quoting from a catalogue rather than from their own packing line.

Our product pages carry this data because buyers ask for it in the first email — the [dinosaur egg bubble machine](/products/wholesale-dinosaur-egg-bubble-machine-toy-automatic-electric-bubble-blower-with-dynamic-music-cool-led-lights-for-kids-outdoor-play/) and the [DIY makeup craft box](/products/diy-kids-makeup-craft-box-with-electric-nail-grinder/) both list carton size, units per carton and CBM, which is enough to run the calculation above before you inquire.

## Quick reference

| If you know | You can work out |
|---|---|
| CBM per carton | cartons per container (÷ 28 / 58 / 68) |
| Units per carton | total units per container |
| Gross kg per carton | total shipment weight (check against payload) |
| Impossible carton count | the container is the wrong size — re-plan before booking |
