import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sale } from "@/types/api"

interface MySalesTableProps {
    sales: Sale[];
}

export function MySalesTable({ sales }: MySalesTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Imagen</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sales.map((sale) => (
                    <TableRow key={sale.id}>
                        <TableCell>
                            {sale.image_url && (
                                <img src={sale.image_url} alt={sale.name} className="w-12 h-12 object-cover rounded" />
                            )}
                        </TableCell>
                        <TableCell className="font-medium">{sale.name}</TableCell>
                        <TableCell>${sale.price}</TableCell>
                        <TableCell>
                            <Badge>{sale.status}</Badge>
                        </TableCell>
                        <TableCell>{new Date(sale.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Ver</Button>
                            <Button variant="ghost" size="sm">Editar</Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
