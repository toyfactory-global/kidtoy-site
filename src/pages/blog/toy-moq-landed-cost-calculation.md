---
layout: ../../layouts/BlogLayout.astro
title: "Toy MOQ and Landed Cost: The Calculation Most Buyers Get Wrong"
description: "MOQ is usually a carton quantity in disguise, and landed cost is not the unit price plus shipping. A worked example using a real carton: 72 pcs per carton, 0.254 CBM, 29.4 kg gross weight."
date: "2026-10-21"
related:
  - wholesale-dinosaur-egg-bubble-machine-toy-automatic-electric-bubble-blower-with-dynamic-music-cool-led-lights-for-kids-outdoor-play
  - high-volume-cartoon-bubble-blower-gun-12000-per-min
  - wholesale-electric-sunflower-bubble-machine-usb-rechargeable-flower-bubble-blower-with-cool-led-lights-for-kids-outdoor-play
---

**Short answer:** MOQ is almost never a round number someone chose. It is the factory's carton quantity multiplied by the number of cartons they are willing to run — which is why MOQs like 216, 288 and 360 appear instead of 200, 300 and 400. And landed cost is the unit price plus freight, duty, clearance and inland delivery, divided by the units that actually arrive sellable.

Both are arithmetic. Both are routinely estimated wrong by 20–40%.

## Why MOQ numbers look strange

A factory does not make "one toy". It makes a production run, packs it into export cartons, and ships cartons.

Take a real product from our catalogue — a dinosaur egg bubble machine:

| Field | Value |
|---|---|
| Item | S216414 |
| Units per carton | 72 pcs |
| Carton size | 84.5 × 43 × 70 cm |
| Volume per carton | 0.254 CBM |
| Gross weight per carton | 29.4 kg |
| MOQ | 360 pcs |

360 is exactly **five cartons**. That is not a coincidence. The factory will not open a production line, mould a colour run and pack a partial carton for one box.

This is why you see MOQs of 216 (3 × 72), 288 (4 × 72), 360 (5 × 72) rather than 250 or 300. If a supplier quotes you "MOQ 300" on a product with 72 pcs per carton, ask how they will pack the remaining 12 units.

## Where the MOQ actually comes from

Three different constraints produce the number, and they are not interchangeable:

1. **Carton multiple** — the unit count you can physically pack.
2. **Mould and colour run** — a custom colour or a new logo requires a minimum run on the machine.
3. **Material minimum** — a plastic or fabric supplier may only sell in 500 kg lots, which caps how small a run can be.

A quotation that says "MOQ 360, custom colour MOQ 1,000" is telling you that constraint 1 applies to the stock colour and constraint 2 applies to your colour. That is a normal, honest answer. A supplier who says "MOQ 100" on a 72-per-carton item is either repacking or reselling.

## Tiered pricing is not a discount, it is a cost curve

Almost every factory price list has two or three tiers. Ours reads:

| Quantity | Unit price |
|---|---|
| 80 – 159 pcs | $6.06 |
| 160 + pcs | $5.57 |

The 8% step is not generosity. Larger runs amortise three fixed costs: setting up the machine, printing the colour box, and packing a full carton instead of a partial one. When you negotiate, ask **what quantity unlocks the next tier** — it is usually a more useful conversation than asking for a discount at a fixed volume.

## The landed cost formula

```
Landed cost per unit =
  (unit price × qty)
+ freight
+ duty
+ clearance & port fees
+ inland delivery to your warehouse
+ inspection / testing
- salvage value of defects
  ─────────────────────────────────
  sellable units received
```

The last two lines are what separate a real landed cost from an optimistic one. Defect allowance is typically agreed as an AQL, and the units you cannot sell are a cost.

## Worked example

Using the S216414 figures above, ordering exactly at MOQ:

| Line | Calculation | Value |
|---|---|---|
| Units | 5 cartons × 72 | 360 pcs |
| Goods value | 360 × $2.65 | $954.00 |
| Volume | 5 × 0.254 CBM | 1.27 CBM |
| Gross weight | 5 × 29.4 kg | 147 kg |
| Freight (LCL) | 1.27 CBM × *your forwarder's rate per CBM* | *variable* |
| Duty | goods value × *the rate for the HS line* | *variable* |
| Clearance & port | forwarder's fixed fee | *variable* |
| Inland delivery | forwarder's quote | *variable* |

Notice what the table does **not** contain: a freight rate. Freight moves weekly and varies by lane, season and whether you ship LCL or FCL. Any article that gives you a number is giving you a number for a different shipment than yours.

What the table does give you is the two inputs nobody can argue with — **1.27 CBM and 147 kg**. Ask three forwarders to price those two figures and you have a real freight comparison in a day.

### A trap worth naming: volumetric weight

Air freight and express charge on **volumetric weight**, not actual weight:

```
volumetric kg = (L × W × H in cm) / 6000     [most express carriers]
```

For this carton: (84.5 × 43 × 70) / 6000 = **42.4 kg volumetric per carton**, against 29.4 kg actual. You will be charged on 42.4 kg. Low-density toys lose badly on air — which is why bubble machines and plush go by sea and only samples go by air.

## Three mistakes that cost real money

**1. Quoting FOB as landed cost.** FOB ends at the port of loading. Everything after that — ocean freight, destination charges, duty, trucking — is yours. A 15% gap between two suppliers on unit price can invert once freight and duty are included.

**2. Forgetting the carton count.** "360 pieces" tells you nothing about cost. "5 cartons, 1.27 CBM, 147 kg" tells you everything. Always ask for carton count, CBM and gross weight in the same message as the unit price.

**3. Comparing unit prices at different MOQ tiers.** A $5.57 price at 160+ against a competitor's $6.06 at 80–159 is a comparison of two different orders. Normalise to the same quantity before you decide.

## What to put in an inquiry

Send this, and the quote you get back will be directly comparable:

> Item number, quantity in units, destination city and country, preferred Incoterm, and whether the order is stock colour or custom.

You can run the numbers on any of our product pages — the [sunflower bubble machine](/products/wholesale-electric-sunflower-bubble-machine-usb-rechargeable-flower-bubble-blower-with-cool-led-lights-for-kids-outdoor-play) and the [high-volume cartoon bubble blower](/products/high-volume-cartoon-bubble-blower-gun-12000-per-min) both list MOQ and carton data, and they sit at very different MOQ levels (240 versus 360) because of their carton sizes.
