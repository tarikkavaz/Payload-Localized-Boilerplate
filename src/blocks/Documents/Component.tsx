import React from 'react'
import Link from 'next/link'
import { FaFileWord, FaFileExcel, FaFilePdf, FaFilePowerpoint } from 'react-icons/fa6'
import RichText from '@/components/RichText'

type Props = {
  documents: {
    doc: {
      filename: string
      url: string
      mimeType: string
      alt: string
      caption?: {
        [key: string]: any
      }
    }
  }[]
  introContent?: any
}

const getFileIcon = (mimeType: string) => {
  switch (mimeType) {
    case 'application/pdf':
      return <FaFilePdf className="w-6 h-6 mr-2" />
    case 'application/msword':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return <FaFileWord className="w-6 h-6 mr-2" />
    case 'application/vnd.ms-excel':
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      return <FaFileExcel className="w-6 h-6 mr-2" />
    case 'application/vnd.ms-powerpoint':
    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      return <FaFilePowerpoint className="w-6 h-6 mr-2" />
    default:
      return null
  }
}

export const DocumentsBlock: React.FC<Props> = ({ documents, introContent }) => {
  return (
    <div className="container mx-auto max-w-[52rem] border border-card-foreground/30 rounded-lg py-8">
      <div className="mb-4">{introContent && <RichText content={introContent} />}</div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {documents.map((document, i) => (
          <Link
            key={i}
            href={document.doc.url}
            className="p-4 transition-colors rounded-lg bg-foreground/5 hover:bg-foreground/10"
          >
            <h4 className="flex items-center font-semibold ">
              {getFileIcon(document.doc.mimeType)}
              {document.doc.alt}
            </h4>
            {document.doc.caption && (
              <p className="mt-2">{document.doc.caption.root?.children?.[0]?.children?.[0]?.text}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
} 