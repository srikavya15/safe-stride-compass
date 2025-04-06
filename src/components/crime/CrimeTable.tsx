
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Calendar, MapPin } from 'lucide-react';
import { CrimeData } from '@/lib/crimeApi';
import CrimeSeverityBadge from './CrimeSeverityBadge';

interface CrimeTableProps {
  crimes: CrimeData[];
}

const CrimeTable: React.FC<CrimeTableProps> = ({ crimes }) => {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead className="hidden md:table-cell">Date</TableHead>
            <TableHead className="hidden md:table-cell">Location</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {crimes.map((crime) => (
            <TableRow key={crime.id}>
              <TableCell className="font-medium">{crime.type}</TableCell>
              <TableCell>
                <CrimeSeverityBadge severity={crime.severity} />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {crime.date ? (
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                    {crime.date}
                  </div>
                ) : 'N/A'}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {crime.address ? (
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                    {crime.address}
                  </div>
                ) : 'N/A'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CrimeTable;
