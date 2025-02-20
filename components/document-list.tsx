import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Download, Share2, MoreVertical } from 'lucide-react';

interface Document {
  id: number;
  name: string;
  type: string;
  date: string;
  size: string;
}

const documents: Document[] = [
  {
    id: 1,
    name: 'Contract_Draft_v1.pdf',
    type: 'PDF',
    date: '2024-03-27',
    size: '2.4 MB'
  },
  {
    id: 2,
    name: 'Legal_Brief.docx',
    type: 'Word',
    date: '2024-03-26',
    size: '1.8 MB'
  },
  {
    id: 3,
    name: 'Evidence_Photos.zip',
    type: 'Archive',
    date: '2024-03-25',
    size: '5.2 MB'
  }
];

export function DocumentList() {
  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4">
        {documents.map((doc) => (
          <Card key={doc.id} className="p-4 hover:bg-accent/5 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">{doc.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {doc.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {doc.size}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {doc.date}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}