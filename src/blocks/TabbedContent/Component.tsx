'use client'

import React, { useState } from 'react'
import { cn } from '@/utilities/ui'
import RichText from '@/components/RichText'
import { motion } from 'framer-motion'

export type TabType = {
  title: string
  description?: string
  content: any
}

export type Props = {
  orientation: 'horizontal' | 'vertical'
  tabs: TabType[]
}

export const TabbedContentBlock: React.FC<Props> = ({ orientation = 'horizontal', tabs = [] }) => {
  const [activeTab, setActiveTab] = useState(0)

  if (!tabs || tabs.length === 0) return null

  return (
    <div className="container rounded">
      <div
        className={cn('flex', {
          'flex-col md:flex-row': orientation === 'vertical',
          'flex-col': orientation === 'horizontal',
        })}
      >
        {/* Tab Navigation */}
        <div
          className={cn('flex relative', {
            'md:w-1/3 flex-col pr-2': orientation === 'vertical',
            'w-full flex-row flex-wrap gap-2 pb-2': orientation === 'horizontal',
          })}
          role="tablist"
        >
          {tabs.map((tab, index) => (
            <button
              key={index}
              role="tab"
              aria-selected={activeTab === index}
              aria-controls={`tab-panel-${index}`}
              onClick={() => setActiveTab(index)}
              className={cn(
                'relative px-4 py-2 text-left transition-colors duration-200 cursor-pointer',
                'focus:outline-none focus:ring-1 dark:focus:ring-gray-800 focus:ring-gray-200',
                orientation === 'vertical' ? 'focus:ring-inset' : '',
                activeTab !== index && 'hover:text-primary/60',
              )}
              style={{
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {activeTab === index && (
                <motion.span
                  layoutId={`bubble-${orientation}`}
                  className="absolute inset-0 z-10 bg-black rounded-lg dark:bg-white"
                  transition={{
                    type: 'spring',
                    bounce: 0.15,
                    stiffness: 55,
                    damping: 12,
                  }}
                />
              )}
              <div className="relative z-20 font-medium mix-blend-difference">
                <span className="text-white dark:text-white">{tab.title}</span>
              </div>
              {orientation === 'vertical' && tab.description && (
                <div className="relative z-20 mt-1 text-sm mix-blend-difference">
                  <span className="text-white/60 dark:text-white/60">{tab.description}</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div
          className={cn('flex-1 relative grid', {
            'md:w-3/4 p-2 border-t sm:border-t-0 sm:border-l border-primary':
              orientation === 'vertical',
            'w-full p-2 border-t border-primary': orientation === 'horizontal',
          })}
        >
          {tabs.map((tab, index) => (
            <div
              key={index}
              className={cn(
                'col-start-1 row-start-1 w-full',
                activeTab === index ? 'visible' : 'invisible',
              )}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={activeTab === index ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="prose max-w-none"
              >
                {orientation === 'horizontal' && tab.description && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={activeTab === index ? { opacity: 1, y: 0 } : { opacity: 0, y: -5 }}
                    className="mb-4 text-foreground/60"
                  >
                    {tab.description}
                  </motion.div>
                )}
                <RichText
                  content={tab.content}
                  className="[&_p]:!col-start-1"
                  enableGutter={false}
                />
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
