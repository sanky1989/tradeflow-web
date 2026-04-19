import React from "react";

const STATUS_DATA = [
  { name: "Approved", value: 60 },
  { name: "Pending", value: 25 },
  { name: "Rejected", value: 15 },
];

export default function StatusCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-8 flex flex-col">
      <h3>Quote Status</h3>

      {STATUS_DATA.map((item) => (
        <div key={item.name}>
          <span>{item.name}</span>
          <span>{item.value}%</span>
        </div>
      ))}
    </div>
  );
}