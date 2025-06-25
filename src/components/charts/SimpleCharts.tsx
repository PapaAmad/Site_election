import React from "react";

interface ChartData {
  name: string;
  votes: number;
  percentage: number;
  color?: string;
}

interface SimpleBarChartProps {
  data: ChartData[];
  height?: number;
}

export const SimpleBarChart: React.FC<SimpleBarChartProps> = ({
  data,
  height = 300,
}) => {
  const maxVotes = Math.max(...data.map((d) => d.votes));

  return (
    <div className="w-full" style={{ height }}>
      <div className="h-full flex items-end justify-around p-4 bg-gray-50 rounded-lg">
        {data.map((item, index) => {
          const barHeight = (item.votes / maxVotes) * (height - 80);
          const color = item.color || "#3B82F6";

          return (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div className="text-xs font-medium text-center">
                {item.votes}
              </div>
              <div
                className="w-12 rounded-t transition-all duration-300 hover:opacity-80"
                style={{
                  height: barHeight,
                  backgroundColor: color,
                  minHeight: "20px",
                }}
              />
              <div className="text-xs text-center text-gray-600 max-w-[60px] break-words">
                {item.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface SimplePieChartProps {
  data: ChartData[];
  size?: number;
}

export const SimplePieChart: React.FC<SimplePieChartProps> = ({
  data,
  size = 200,
}) => {
  const total = data.reduce((sum, item) => sum + item.votes, 0);
  const center = size / 2;
  const radius = size / 2 - 20;

  let cumulativePercentage = 0;

  const slices = data.map((item, index) => {
    const percentage = (item.votes / total) * 100;
    const startAngle = cumulativePercentage * 3.6; // Convert to degrees
    const endAngle = (cumulativePercentage + percentage) * 3.6;

    cumulativePercentage += percentage;

    // Calculate path for SVG arc
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;

    const largeArcFlag = percentage > 50 ? 1 : 0;

    const x1 = center + radius * Math.cos(startAngleRad);
    const y1 = center + radius * Math.sin(startAngleRad);
    const x2 = center + radius * Math.cos(endAngleRad);
    const y2 = center + radius * Math.sin(endAngleRad);

    const pathData = [
      `M ${center} ${center}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      "Z",
    ].join(" ");

    return {
      pathData,
      color: item.color || `hsl(${(index * 360) / data.length}, 70%, 50%)`,
      item,
    };
  });

  return (
    <div className="flex items-center space-x-4">
      <svg width={size} height={size} className="drop-shadow-sm">
        {slices.map((slice, index) => (
          <path
            key={index}
            d={slice.pathData}
            fill={slice.color}
            stroke="white"
            strokeWidth="2"
            className="hover:opacity-80 transition-opacity cursor-pointer"
          />
        ))}
      </svg>

      <div className="space-y-2">
        {data.map((item, index) => {
          const color =
            item.color || `hsl(${(index * 360) / data.length}, 70%, 50%)`;
          return (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="font-medium">{item.name}:</span>
              <span>{item.percentage.toFixed(1)}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface SimpleProgressBarProps {
  data: ChartData[];
}

export const SimpleProgressBar: React.FC<SimpleProgressBarProps> = ({
  data,
}) => {
  const total = data.reduce((sum, item) => sum + item.votes, 0);

  return (
    <div className="space-y-3">
      {data.map((item, index) => {
        const percentage = (item.votes / total) * 100;
        const color = item.color || "#3B82F6";

        return (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{item.name}</span>
              <span className="text-gray-600">
                {item.votes} votes ({percentage.toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="h-3 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: color,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
