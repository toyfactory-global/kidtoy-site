/**
 * One map, two consumers: product pages link up to the guides a buyer of that
 * category needs, and collection pages link to the same set. Before this module
 * existed only 11 of the 66 guides received a single internal link, and
 * collection pages — which carry a third of the site's search impressions — had
 * none at all.
 *
 * Keep this to six per category: enough to spread links, short enough that the
 * block stays readable on a phone.
 */
export type GuideLink = { slug: string; title: string };

export const GUIDE_MAP: Record<string, GuideLink[]> = {
  'water-guns': [
    { slug: 'electric-water-gun-specs-that-matter', title: 'Which water gun specs actually matter' },
    { slug: 'water-gun-tank-range-specs', title: 'Tank size, range and why the two conflict' },
    { slug: 'shipping-bubble-toys-batteries-liquids', title: 'Shipping: batteries, liquids and freight' },
    { slug: 'battery-toys-un383-air-freight', title: 'UN38.3 for battery toys, in plain terms' },
    { slug: 'hs-code-9503-toy-import-duty', title: 'How toy import duty is calculated' },
    { slug: 'container-loading-calculation-cartons-cbm', title: 'How many cartons fit in a container' },
  ],
  'bubble-toys': [
    { slug: 'wholesale-bubble-toys-buyers-guide', title: 'The bubble toy category, explained' },
    { slug: 'electric-vs-manual-bubble-toys', title: 'Electric or manual: which sells' },
    { slug: 'bubble-toy-battery-and-charging', title: 'Battery and charging, explained' },
    { slug: 'shipping-bubble-toys-batteries-liquids', title: 'Shipping: batteries, liquids and freight' },
    { slug: 'toy-moq-landed-cost-calculation', title: 'MOQ and landed cost, calculated' },
    { slug: 'container-loading-calculation-cartons-cbm', title: 'How many cartons fit in a container' },
  ],
  'stem-toys': [
    { slug: 'en71-vs-astm-f963-toy-certification', title: 'EN71 vs ASTM F963 vs CPSIA' },
    { slug: 'building-block-sets-piece-count-and-clutch', title: 'What piece count really costs' },
    { slug: 'rc-toys-frequency-range-and-battery-claims', title: 'Frequency, range and battery claims' },
    { slug: 'glow-in-the-dark-toys-material-and-claims', title: 'Glow material, charge time and claims' },
    { slug: 'verify-toy-factory-chenghai-checklist', title: 'Verifying a toy factory before you pay' },
    { slug: 'toy-moq-landed-cost-calculation', title: 'MOQ and landed cost, calculated' },
  ],
  'kids-makeup': [
    { slug: 'kids-makeup-case-formats-buying-guide', title: 'How the case sets your retail price' },
    { slug: 'private-label-kids-makeup-moq-labelling', title: 'Private label: MOQ and label fields' },
    { slug: 'kids-cosmetics-vs-toy-regulation', title: 'Cosmetics law or toy law — which applies' },
    { slug: 'kids-makeup-ingredients-washable', title: 'Washable formulas and ingredient limits' },
    { slug: 'kids-nail-polish-safety', title: 'Nail polish: what the limits really are' },
    { slug: 'wholesale-toy-price-points-by-channel', title: 'Price points by sales channel' },
  ],
};
