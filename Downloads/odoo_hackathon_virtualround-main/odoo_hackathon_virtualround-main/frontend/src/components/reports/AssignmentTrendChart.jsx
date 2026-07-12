import React from 'react';

/**
 * AssignmentTrendChart Component.
 * Custom SVG area line chart visualizing custody assignment frequencies over time.
 * @param {Object} props
 */
export const AssignmentTrendChart = ({ data = [] }) => {
  const values = data.map((d) => d.value);
  const maxVal = Math.max(...values, 5); // Scale limit fallback

  // Dimension details
  const svgWidth = 400;
  const svgHeight = 220;
  const marginTop = 20;
  const marginRight = 20;
  const marginBottom = 30;
  const marginLeft = 40;

  const chartWidth = svgWidth - marginLeft - marginRight;
  const chartHeight = svgHeight - marginTop - marginBottom;

  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  // Calculate coordinate coordinates
  const points = data.map((item, index) => {
    const spacing = data.length > 1 ? chartWidth / (data.length - 1) : chartWidth;
    const xVal = marginLeft + index * spacing;
    const yVal = svgHeight - marginBottom - (item.value / maxVal) * chartHeight;
    return { x: xVal, y: yVal, value: item.value, label: item.label };
  });

  // Construct SVG paths
  const linePath = points.reduce((path, p, i) => `${path}${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
  
  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${svgHeight - marginBottom} L ${points[0].x} ${svgHeight - marginBottom} Z`
    : '';

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
        Monthly Assignment Trend
      </h4>

      {data.length === 0 ? (
        <div style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
          No assignment trend logs.
        </div>
      ) : (
        <div style={{ width: '100%', flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} width="100%" height="100%" style={{ overflow: 'visible' }}>
            {/* Gridlines & Y-axis labels */}
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
                    {labelVal.toFixed(0)}
                  </text>
                </g>
              );
            })}

            {/* Area under the line */}
            {areaPath && (
              <path
                d={areaPath}
                fill="rgba(99, 102, 241, 0.08)"
                stroke="none"
                style={{ transition: 'all 0.5s ease' }}
              />
            )}

            {/* Trend line */}
            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transition: 'all 0.5s ease' }}
              />
            )}

            {/* Coordinate Node Points */}
            {points.map((p, index) => (
              <g key={index}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="4"
                  fill="var(--color-surface)"
                  stroke="var(--color-primary)"
                  strokeWidth="2"
                  style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
                >
                  <title>{`${p.label}: ${p.value} Assignments`}</title>
                </circle>
                {/* Month labels */}
                <text
                  x={p.x}
                  y={svgHeight - marginBottom + 16}
                  fill="var(--color-text-muted)"
                  fontSize="8.5"
                  textAnchor="middle"
                >
                  {p.label.split(' ')[0]}
                </text>
              </g>
            ))}

            {/* Base line */}
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
