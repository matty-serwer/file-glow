'use client';

import React from 'react'
import SearchBar from '@/components/SearchBar/SearchBar'
import UploadButton from '@/components/UploadButton/UploadButton'
import { useSearch } from '@/contexts/SearchContext';

const FileActions = () => {
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-4xl font-bold" data-testid="page-title">Your Files</h1>
      <SearchBar
        setQuery={setSearchQuery}
        query={searchQuery}
      />
      <UploadButton />
    </div>
  )
}

export default FileActions