import { ICategoryAttribute } from '../../core/services/category.service';

export interface DisplayAttribute {
  label: string;
  value: string;
}

export class ListingAttributeFormatter {
  static format(
    schema: ICategoryAttribute[],
    rawValues: Record<string, unknown> | null | undefined,
    currencyCode: string = 'NGN'
  ): DisplayAttribute[] {
    if (!schema || !rawValues) return [];

    const display: DisplayAttribute[] = [];

    // Map according to schema order, ignoring keys not in schema
    for (const attr of schema) {
      const val = rawValues[attr.key];
      if (val === undefined || val === null || val === '') continue;

      let formattedValue = String(val);

      switch (attr.type) {
        case 'BOOLEAN':
          formattedValue = val ? 'Yes' : 'No';
          break;
        case 'NUMBER':
          formattedValue = Number(val).toLocaleString();
          break;
        case 'SELECT':
          formattedValue = String(val);
          break;
        case 'STRING':
          formattedValue = String(val);
          break;
      }

      display.push({
        label: attr.label,
        value: formattedValue,
      });
    }

    return display;
  }
}
