import React, { useMemo, useState } from "react";

const pageSize = 50;

const ResultsList = ({ items, onSelect, getItemId = (it) => it.contract_id, getItemName = (it) => it.contract_name }) => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter((it) => {
      const id = String(getItemId(it) ?? "").toLowerCase();
      const name = String(getItemName(it) ?? "").toLowerCase();
      return id.includes(q) || name.includes(q);
    });
  }, [items, query, getItemId, getItemName]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice((page - 1) * pageSize, page * pageSize);

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="results-list flex flex-col h-full">
      <div className="results-header flex items-center gap-2 p-2 bg-white border-b">
        <input
          className="search-box flex-1 border rounded px-2 py-1"
          placeholder="Search by id or name..."
          
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />
        <div className="result-count text-sm text-gray-600 whitespace-nowrap">
          {filtered.length} result{filtered.length === 1 ? "" : "s"}
        </div>
      </div>

      <div className="results-items flex-1 overflow-y-auto divide-y">
        {current.map((it) => {
          const id = getItemId(it);
          const name = getItemName(it);
        
          return (
            <button
              key={String(id)}
              className="result-item w-full text-left px-3 py-2 hover:bg-gray-50 focus:bg-gray-50"
              onClick={() => onSelect(it)}
            >
              <div className="name font-medium">{name ?? "(no name)"}</div>
              <div className="id text-xs text-gray-500">{String(id)}</div>
            </button>
          );
        })}
        {current.length === 0 && (
          <div className="no-results p-4 text-sm text-gray-500">No results</div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination flex items-center justify-between p-2 border-t bg-white">
          <button className="px-2 py-1 text-sm border rounded disabled:opacity-50" onClick={goPrev} disabled={page === 1}>
            Prev
          </button>
          <div className="text-sm text-gray-600">
            Page {page} / {totalPages}
          </div>
          <button className="px-2 py-1 text-sm border rounded disabled:opacity-50" onClick={goNext} disabled={page === totalPages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ResultsList;


