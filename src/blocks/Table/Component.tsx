import React, { useCallback } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/utilities/ui'

type Props = {
  caption?: string | null
  width?: 'full' | 'auto' | null
  headers?: {
    content: string
    alignment?: 'left' | 'center' | 'right' | null
    id?: string | null
  }[] | null
  rows?: {
    cells?: {
      content: string
      id?: string | null
    }[] | null
    id?: string | null
  }[] | null
  useContainer?: boolean
}

export const TableBlock: React.FC<Props> = ({ caption, width = 'full', headers = [], rows = [], useContainer = false }) => {
  const getAlignmentClass = useCallback((alignment: string | null | undefined) => {
    switch (alignment) {
      case 'center':
        return 'text-center'
      case 'right':
        return 'text-right'
      default:
        return 'text-left'
    }
  }, [])

  if (!headers || !rows) return null

  const table = (
    <div className='mx-8'>
      <Table className={cn(width === 'full' ? 'w-full' : 'w-auto mx-auto')}>
        {caption && <TableCaption className='pt-4 border-t border-t-foreground/20'>{caption}</TableCaption>}
        <TableHeader>
          <TableRow>
            {headers.map((header, index) => (
              <TableHead
                key={index}
                className={cn(
                  'text-background bg-foreground/70',
                  getAlignmentClass(header.alignment),
                  index === 0 && 'rounded-tl-lg',
                  index === headers.length - 1 && 'rounded-tr-lg'
                )}
              >
                {header.content}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, rowIndex) => {
            if (!row.cells) return null
            return (
              <TableRow key={rowIndex}>
                {row.cells.slice(0, headers.length).map((cell, cellIndex) => (
                  <TableCell
                    key={cellIndex}
                    className={cn(
                      headers[cellIndex]?.alignment &&
                        getAlignmentClass(headers[cellIndex].alignment)
                    )}
                  >
                    {cell.content}
                  </TableCell>
                ))}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )

  if (useContainer) {
    return <div className="container">{table}</div>
  }

  return table
}
