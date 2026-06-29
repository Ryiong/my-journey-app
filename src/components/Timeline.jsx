import React from 'react';

export default function Timeline({ items }) {
  return (
    <section class="space-y-4">
      <h2 class="text-sm font-bold uppercase tracking-wider text-outline px-1">Dòng thời gian của bạn</h2>
      <div class="relative border-l-2 border-surface-container-highest ml-3 pl-6 space-y-6">
        {items.map(item => (
          <div key={item.id} class="relative group">
            <div class="absolute -left-[31px] top-1 w-4 h-4 bg-primary rounded-full border-4 border-surface"></div>
            <span class="text-xs font-semibold text-outline">{item.time}</span>
            <div class="mt-2 bg-white rounded-card p-3 border border-surface-container-highest stitch-shadow transition-transform duration-300 hover:-translate-y-1">
              <div class="aspect-video bg-surface-container rounded-lg mb-2 overflow-hidden">
                <img src={item.img} class="w-full h-full object-cover" alt="Captured memory" />
              </div>
              <p class="text-sm text-on-surface font-medium">{item.caption}</p>
              <div class="mt-2 flex">
                <span class="px-2 py-0.5 text-xs font-bold rounded-full bg-secondary-container text-on-secondary-container">#{item.collection}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}