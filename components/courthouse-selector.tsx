'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface Courthouse {
  id: string;
  name: string;
  address: string;
  type: 'district' | 'superior' | 'appellate' | 'supreme' | 'federal';
  rooms: Array<{
    number: string;
    judge?: string;
    type?: string;
  }>;
}

// Example courthouse data - in a real app, this would come from an API
const courthouses: Courthouse[] = [
  {
    id: 'dc-1',
    name: 'District Court Bratislava I',
    address: 'Záhradnícka 10, 812 44 Bratislava',
    type: 'district',
    rooms: [
      { number: '101', judge: 'Judge Smith', type: 'Civil' },
      { number: '102', judge: 'Judge Johnson', type: 'Criminal' },
      { number: '201', judge: 'Judge Davis', type: 'Family' },
    ],
  },
  {
    id: 'rc-1',
    name: 'Regional Court Bratislava',
    address: 'Štúrova 29, 812 49 Bratislava',
    type: 'superior',
    rooms: [
      { number: '301', judge: 'Judge Wilson', type: 'Civil Appeals' },
      { number: '302', judge: 'Judge Brown', type: 'Criminal Appeals' },
      { number: '401', judge: 'Judge Miller', type: 'Commercial' },
    ],
  },
];

interface CourthouseSelectorProps {
  value?: string;
  onChange: (value: string, courthouse: Courthouse) => void;
}

export function CourthouseSelector({
  value,
  onChange
}: CourthouseSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedCourthouse, setSelectedCourthouse] = React.useState<Courthouse | null>(
    () => courthouses.find(c => c.id === value) || null
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedCourthouse ? (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">{selectedCourthouse.name}</span>
            </div>
          ) : (
            "Select courthouse..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search courthouses..." />
          <CommandEmpty>No courthouse found.</CommandEmpty>
          <CommandGroup>
            {courthouses.map((courthouse) => (
              <CommandItem
                key={courthouse.id}
                value={courthouse.id}
                onSelect={(currentValue) => {
                  setSelectedCourthouse(courthouse);
                  onChange(currentValue, courthouse);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedCourthouse?.id === courthouse.id ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  <span>{courthouse.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {courthouse.address}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

interface CourtroomSelectorProps {
  courthouse?: Courthouse;
  value?: string;
  onChange: (room: { number: string; judge?: string; type?: string }) => void;
}

export function CourtroomSelector({
  courthouse,
  value,
  onChange
}: CourtroomSelectorProps) {
  const [open, setOpen] = React.useState(false);

  if (!courthouse) {
    return null;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value || "Select courtroom..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search courtrooms..." />
          <CommandEmpty>No courtroom found.</CommandEmpty>
          <CommandGroup>
            {courthouse.rooms.map((room) => (
              <CommandItem
                key={room.number}
                value={room.number}
                onSelect={() => {
                  onChange(room);
                  setOpen(false);
                }}
              >
                <div className="flex flex-col">
                  <span>Room {room.number}</span>
                  <span className="text-sm text-muted-foreground">
                    {room.judge} - {room.type}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}