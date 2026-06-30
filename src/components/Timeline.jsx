import React from 'react';

export default function Timeline({ items }) {
  return (
    <section className="space-y-4">
      <h2 className="text-sm font-bold uppercase tracking-wider text-outline px-1">Dòng thời gian của bạn</h2>
      <div className="relative border-l-2 border-surface-container-highest ml-3 pl-6 space-y-6">
        {items.map(item => (
          <div key={item.id} className="relative group">
            <div className="absolute -left-[31px] top-1 w-4 h-4 bg-primary rounded-full border-4 border-surface"></div>
            <span className="text-xs font-semibold text-outline">{item.time}</span>
            <div className="mt-2 bg-white rounded-card p-3 border border-surface-container-highest stitch-shadow transition-transform duration-300 hover:-translate-y-1">
              <div className="aspect-video bg-surface-container rounded-lg mb-2 overflow-hidden">
                <img src={item.img} className="w-full h-full object-cover" alt="Captured memory" />
              </div>
              <p className="text-sm text-on-surface font-medium">{item.caption}</p>
              <div className="mt-2 flex">
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-secondary-container text-on-secondary-container">#{item.collection}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}