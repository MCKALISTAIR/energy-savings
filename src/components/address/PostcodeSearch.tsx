
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface PostcodeSearchProps {
  searchPostcode: string;
  setSearchPostcode: (postcode: string) => void;
  onSearch: () => void;
  loading: boolean;
  isMobile?: boolean;
  hasError?: boolean;
}

const PostcodeSearch: React.FC<PostcodeSearchProps> = ({
  searchPostcode,
  setSearchPostcode,
  onSearch,
  loading,
  isMobile = false,
  hasError = false
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Enter postcode (e.g. SW1A 1AA)"
        value={searchPostcode}
        onChange={(e) => setSearchPostcode(e.target.value.toUpperCase())}
        onKeyPress={handleKeyPress}
        className={`flex-1 ${hasError ? 'border-red-500' : ''} ${isMobile ? 'h-12 text-base' : ''}`}
      />
      <Button 
        onClick={onSearch} 
        disabled={!searchPostcode.trim() || loading}
        className={isMobile ? 'h-12 px-6' : ''}
      >
        <Search className="w-4 h-4" />
        {loading ? 'Searching...' : 'Search'}
      </Button>
    </div>
  );
};

export default PostcodeSearch;
