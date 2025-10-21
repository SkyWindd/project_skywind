// src/components/product/SpecsTable.jsx
import React from "react";

/**
 * specs: object { key: value }
 */
export default function SpecsTable({ specs = {} }) {
  const entries = Object.entries(specs);
  if (!entries.length) return null;

  return (
    <section id="specs" className="mt-6">
      <div className="rounded-lg border bg-white p-4">
        <h2 className="text-lg font-semibold mb-3">Thông tin sản phẩm</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm table-auto">
            <tbody>
              {entries.map(([key, val]) => (
                <tr key={key} className="border-t">
                  <td className="w-1/3 py-3 text-gray-600 font-medium">{key}</td>
                  <td className="py-3">{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
      </div>
    </section>
  );
}
