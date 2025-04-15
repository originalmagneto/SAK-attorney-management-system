import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card } from '@/components/ui/card';
import { SparkleEffect } from '@/components/ui/SparkleEffect';
import { ArrowUpRight } from 'lucide-react';
import AnimatedNumber from '@/components/ui/AnimatedNumber';

interface StatsCardProps {
  stat: {
    name: string;
    value: string | number;
    icon: React.ElementType;
    change: string;
    href: string;
    color: string;
  };
  index: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ stat, index }) => {
  const [sparkle, setSparkle] = React.useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(80,80,200,0.08)' }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 120 }}
      onMouseEnter={() => setSparkle(true)}
      onAnimationComplete={() => setSparkle(false)}
      className="relative"
    >
      <Link href={stat.href}>
        <Card
          variant="glass"
          className="overflow-hidden group stats-card"
        >
          <div className="relative p-6">
            <SparkleEffect trigger={sparkle} duration={900} />
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.6 }}
                className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}
              >
                <stat.icon className="h-6 w-6 text-foreground" />
              </motion.div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.name}
                </p>
                <h3 className="text-2xl font-bold mt-1">
                  <AnimatedNumber value={typeof stat.value === 'string' ? parseFloat(stat.value) || 0 : stat.value} />
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.change}
                </p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};

export default StatsCard;
