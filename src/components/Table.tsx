import React, { useState } from "react";

type TableProps<T> = {
  columns: { key: keyof T; header: string }[];
  data: T[];
};

export const Table = <T extends { selected?: boolean }>({
  columns,
  data,
}: TableProps<T>) => {
  const [rows, setRows] = useState<T[]>(data);

  const handleSelectRow = (index: number, checked: boolean) => {
    const newRows = [...rows];
    newRows[index] = {
      ...newRows[index],
      selected: checked,
    };
    setRows(newRows);
  };

  return (
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          {columns.map((col) => {
            return (
              <th
                key={col.key as string}
                style={{ border: "1px solid black", padding: "8px" }}
              >
                {col.header === "Health" ? "test" : col.header}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <tr key={idx}>
            {columns.map((col) => {
              if (col.key === "selected") {
                return (
                  <td
                    key={col.key as string}
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={row.selected || false}
                      onChange={(e) => handleSelectRow(idx, e.target.checked)}
                    />
                  </td>
                );
              }
              return (
                <td
                  key={col.key as string}
                  style={{ border: "1px solid black", padding: "8px" }}
                >
                  {row[col.key] as React.ReactNode}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
