// components/DataTable.tsx
import React, { useState } from 'react';
import { useQuery } from 'react-query';

interface DataItem {
  id: string;
  name: string;
  value: number;
}

interface DataTableProps {
  endpoint: string;
}

export const DataTable: React.FC<DataTableProps> = ({ endpoint }) => {
  const [filterText, setFilterText] = useState('');

  const { data, status, error } = useQuery<DataItem[], Error>(
    'data',
    () => fetch(endpoint).then(res => res.json()),
    {
      suspense: true, // 使用React Suspense来处理加载状态
    }
  );

  const filteredData = data?.filter(item =>
    item.name.toLowerCase().includes(filterText.toLowerCase())
  ) || [];

  return (
    <div>
      <input
        type="text"
        placeholder="Filter by name"
        value={filterText}
        onChange={e => setFilterText(e.target.value)}
      />
      {status === 'loading' ? (
        <div>Loading...</div>
      ) : status === 'error' ? (
        <div>Error: {error?.message}</div>
      ) : (
        <ul>
          {filteredData.map(item => (
            <li key={item.id}>{item.name} - {item.value}</li>
          ))}
        </ul>
      )}
    </div>
  );
};