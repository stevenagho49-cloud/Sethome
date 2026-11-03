// Delivery areas by postcode district. Edit to match where you deliver.
export const deliveryAreas: Record<string, string> = {
  B1: 'City Centre', B2: 'City Centre', B3: 'City Centre', B4: 'City Centre', B5: 'City Centre',
  B6: 'Aston', B7: 'Aston',
  B15: 'Edgbaston', B16: 'Edgbaston',
  B17: 'Harborne',
  B29: 'Selly Oak',
};

export function checkPostcode(raw: string): { ok: boolean; area?: string } {
  const pc = raw.toUpperCase().replace(/\s+/g, '');
  if (!pc) return { ok: false };
  const outward = pc.length > 4 ? pc.slice(0, -3) : pc;
  const area = deliveryAreas[outward];
  return area ? { ok: true, area } : { ok: false };
}
export const areaNames = Array.from(new Set(Object.values(deliveryAreas)));
