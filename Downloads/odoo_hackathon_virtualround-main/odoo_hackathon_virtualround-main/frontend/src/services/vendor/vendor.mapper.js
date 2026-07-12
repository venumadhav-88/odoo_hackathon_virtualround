import { VendorModel } from '@/models/vendor.model';

export const vendorMapper = {
  toDomain(raw) {
    if (!raw) return null;
    return new VendorModel({ ...raw });
  },

  toPersistence(domain) {
    if (!domain) return null;
    return { ...domain };
  },
};