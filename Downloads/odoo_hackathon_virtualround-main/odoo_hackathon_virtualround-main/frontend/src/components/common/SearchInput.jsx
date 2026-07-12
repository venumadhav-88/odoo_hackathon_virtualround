import React from 'react';
import { Search } from 'lucide-react';

export const SearchInput = ({ value, onChange, placeholder = 'Search...' }) => {
  return (
    <div className="header-search">
      <Search size={16} className="header-search-icon" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="header-search-input"
      />
    </div>
  );
};
