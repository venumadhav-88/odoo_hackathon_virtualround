import React from 'react';
import { formatCurrency } from '@/utils/formatters';

/**
 * MaintenanceCostChart Component.
 * Custom vertical SVG bar chart summarizing costs by maintenance type.
 * @param {Object} props
 */
export const MaintenanceCostChart = ({ data = [] }) => {
  const values = data.map((d) => d.value);
  const maxVal = Math.max(...values, 100); // Lower limit fallback scale

  // Size Specifications
  const svgWidth = 400;
  const svgHeight = 220;
  const marginTop = 20;
  const marginRight = 15;
  const marginBottom = 30;
  const marginLeft = 60;

  const chartWidth = svgWidth - marginLeft - marginRight;
  const chartHeight = svgHeight - marginTop - marginBottom;

  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
        padding: '0.25rem',
      }}
    >
      <h4 style={{ fontSize: '0.925rem', fontWeight: 600, marginBottom: '1.25rem', color: 'var(--color-text-main)' }}>
        servicing Cost Breakdown (USD)
      </h4>

      {data.length === 0 ? (
        <div style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
          No maintenance logs recorded.
        </div>
      ) : (
        <div style={{ width: '100%', flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} width="100%" height="100%" style={{ overflow: 'visible' }}>
            {/* Horizontal Gridlines & Y-axis labels */}
            {yTicks.map((tick, index) => {
              const yVal = svgHeight - marginBottom - tick * chartHeight;
              const labelVal = tick * maxVal;
              return (
                <g key={index}>
                  <line
                    x1={marginLeft}
                    y1={yVal}
                    x2={svgWidth - marginRight}
                    y2={yVal}
                    stroke="var(--color-border)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <text x={marginLeft - 8} y={yVal + 4} fill="var(--color-text-muted)" fontSize="9" textAnchor="end">
                    ${labelVal >= 1000 ? `${(labelVal / 1000).toFixed(1)}k` : labelVal.toFixed(0)}
                  </text>
                </g>
              );
            })}

            {/* Vertical Bars & X-axis Labels */}
            {data.map((item, index) => {
              const barWidth = Math.max(30 - data.length * 2, 16);
              const spacing = chartWidth / data.length;
              const xVal = marginLeft + index * spacing + (spacing - barWidth) / 2;
              const barHeight = (item.value / maxVal) * chartHeight;
              const yVal = svgHeight - marginBottom - barHeight;

              return (
                <g key={item.name}>
                  {/* Column block */}
                  <rect
                    x={xVal}
                    y={yVal}
                    width={barWidth}
                    height={Math.max(barHeight, 3)}
                    fill="var(--color-primary)"
                    rx="3"
                    ry="3"
                    style={{ transition: 'all 0.4s ease', cursor: 'pointer' }}
                  >
                    <title>{`${item.name}: ${formatCurrency(item.value)}`}</title>
                  </rect>
                  {/* Label tag */}
                  <text
                    x={xVal + barWidth / 2}
                    y={svgHeight - marginBottom + 16}
                    fill="var(--color-text-muted)"
                    fontSize="8.5"
                    textAnchor="middle"
                  >
                    {item.name.substring(0, 10)}
                  </text>
                </g>
              );
            })}

            {/* Axis base */}
            <line
              x1={marginLeft}
              y1={svgHeight - marginBottom}
              x2={svgWidth - marginRight}
              y2={svgHeight - marginBottom}
              stroke="var(--color-border)"
              strokeWidth="1"
            />
          </svg>
        </div>
      )}
    </div>
  );
};
