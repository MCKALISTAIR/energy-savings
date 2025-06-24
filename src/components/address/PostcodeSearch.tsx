
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface PostcodeSearchProps {
  searchPostcode: string;
  setSearchPostcode: (value: string) => void;
  onSearch: () => void;
  loading: boolean;
  isMobile?: boolean;
}

const PostcodeSearch: React.FC<PostcodeSearchProps> = ({
  searchPostcode,
  setSearchPostcode,
  onSearch,
  loading,
  isMobile = false
}) => {
  return (
    <div className={`flex gap-2 ${isMobile ? 'flex-col' : ''}`}>
      <Input
        id="postcode"
        value={searchPostcode}
        onChange={(e) => setSearchPostcode(e.target.value.toUpperCase())}
        placeholder="Enter postcode (e.g. SW1A 1AA)"
        className={`${isMobile ? 'h-12 text-base' : 'flex-1'}`}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onSearch();
          }
        }}
      />
      <Button 
        type="button" 
        onClick={onSearch}
        disabled={loading || !searchPostcode.trim()}
        variant="default"
        className={`${isMobile ? 'h-12 text-base' : 'px-4'}`}
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <Search className="w-4 h-4 mr-2" />
            Search
          </>
        )}
      </Button>
    </div>
  );
};

export default PostcodeSearch;
