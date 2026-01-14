import { motion } from "framer-motion";
import { useState } from "react";

interface AnimatedTagsProps {
  tags: string[];
}

export function AnimatedTags({ tags }: AnimatedTagsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Radar chart data points (5 categories like the reference image)
  const categories = ["VALUES", "LIFESTYLE", "HOBBIES", "SOCIAL", "AMBITION"];
  const values = [85, 70, 90, 65, 80]; // Mock values for radar
  
  const centerX = 80;
  const centerY = 80;
  const maxRadius = 55;

  // Calculate polygon points for the radar shape
  const getPolygonPoints = (radius: number) => {
    return categories.map((_, i) => {
      const angle = (Math.PI * 2 * i) / categories.length - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      return `${x},${y}`;
    }).join(" ");
  };

  const getValuePolygonPoints = () => {
    return values.map((value, i) => {
      const angle = (Math.PI * 2 * i) / categories.length - Math.PI / 2;
      const radius = (value / 100) * maxRadius;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      return `${x},${y}`;
    }).join(" ");
  };

  const getLabelPosition = (index: number) => {
    const angle = (Math.PI * 2 * index) / categories.length - Math.PI / 2;
    const radius = maxRadius + 18;
    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    };
  };

  return (
    <div className="bg-card rounded-xl p-4 border border-border">
      {/* Radar Chart */}
      <div className="relative flex justify-center">
        <svg width="160" height="160" className="overflow-visible">
          {/* Background pentagon rings */}
          {[0.2, 0.4, 0.6, 0.8, 1].map((scale, i) => (
            <motion.polygon
              key={i}
              points={getPolygonPoints(maxRadius * scale)}
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: i * 0.1 }}
            />
          ))}
          
          {/* Axis lines */}
          {categories.map((_, i) => {
            const angle = (Math.PI * 2 * i) / categories.length - Math.PI / 2;
            const endX = centerX + Math.cos(angle) * maxRadius;
            const endY = centerY + Math.sin(angle) * maxRadius;
            return (
              <line
                key={i}
                x1={centerX}
                y1={centerY}
                x2={endX}
                y2={endY}
                stroke="hsl(var(--muted))"
                strokeWidth="1"
                opacity="0.3"
              />
            );
          })}
          
          {/* Value polygon */}
          <motion.polygon
            points={getValuePolygonPoints()}
            fill="hsl(var(--primary) / 0.2)"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ transformOrigin: `${centerX}px ${centerY}px` }}
          />

          {/* Category labels */}
          {categories.map((cat, i) => {
            const pos = getLabelPosition(i);
            return (
              <motion.text
                key={cat}
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-muted-foreground text-[8px] font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                {cat}
              </motion.text>
            );
          })}
        </svg>
      </div>

      {/* Common Ground Tags */}
      <div className="mt-3">
        <p className="text-xs font-medium text-muted-foreground mb-2">Common Ground</p>
        <div className="flex flex-wrap gap-1.5">
          {(tags ?? []).slice(0, 4).map((tag, index) => (
            <motion.span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-[10px] font-medium rounded-full border border-primary/20 cursor-pointer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              whileHover={{ 
                scale: 1.05, 
                backgroundColor: "hsl(var(--primary) / 0.2)",
              }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
            >
              <motion.span
                animate={{ 
                  rotate: hoveredIndex === index ? [0, -10, 10, 0] : 0 
                }}
                transition={{ duration: 0.3 }}
              >
                ✦
              </motion.span>
              {tag}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}
