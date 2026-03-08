'use client';

import { useState } from 'react';
import { Trash2, Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { ProductVariant } from '@/lib/api/products';
import { formatPrice, poundsToCents, centsToPounds } from '@/utils/price';

interface VariantTableProps {
  variants: ProductVariant[];
  onUpdate: (id: string, data: Partial<ProductVariant>) => void;
  onDelete: (id: string) => void;
  onBulkUpdate: (field: keyof ProductVariant, value: any) => void;
}

export function VariantTable({ variants, onUpdate, onDelete, onBulkUpdate }: VariantTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<ProductVariant>>({});
  
  // Bulk update state
  const [bulkPrice, setBulkPrice] = useState('');
  const [bulkStock, setBulkStock] = useState('');

  const handleEdit = (variant: ProductVariant) => {
    setEditingId(variant.id);
    setEditValues({
      sku: variant.sku,
      price: variant.price,
      stock: variant.stock
    });
  };

  const handleSave = (id: string) => {
    onUpdate(id, editValues);
    setEditingId(null);
    setEditValues({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({});
  };

  const applyBulkPrice = () => {
    if (!bulkPrice) return;
    const cents = poundsToCents(parseFloat(bulkPrice));
    onBulkUpdate('price', cents);
    setBulkPrice('');
  };

  const applyBulkStock = () => {
    if (!bulkStock) return;
    const stock = parseInt(bulkStock);
    onBulkUpdate('stock', stock);
    setBulkStock('');
  };

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      <div className="flex flex-wrap gap-4 p-4 bg-muted/30 rounded-lg border">
        <div className="flex items-end gap-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Set Price for All</label>
            <Input 
              type="number" 
              placeholder="0.00" 
              className="h-8 w-24" 
              value={bulkPrice}
              onChange={(e) => setBulkPrice(e.target.value)}
            />
          </div>
          <Button size="sm" variant="outline" onClick={applyBulkPrice}>Apply</Button>
        </div>

        <div className="flex items-end gap-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Set Stock for All</label>
            <Input 
              type="number" 
              placeholder="0" 
              className="h-8 w-24" 
              value={bulkStock}
              onChange={(e) => setBulkStock(e.target.value)}
            />
          </div>
          <Button size="sm" variant="outline" onClick={applyBulkStock}>Apply</Button>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Variant</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {variants.map((variant) => {
              const isEditing = editingId === variant.id;
              // Extract variant name from SKU or attributes if available
              // For now using SKU parts
              const name = variant.sku?.split('-').slice(2).join(' / ') || 'Variant';

              return (
                <TableRow key={variant.id}>
                  <TableCell className="font-medium">{name}</TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Input 
                        value={editValues.sku} 
                        onChange={(e) => setEditValues({...editValues, sku: e.target.value})}
                        className="h-8 w-32"
                      />
                    ) : (
                      variant.sku
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Input 
                        type="number"
                        value={centsToPounds(editValues.price || 0)} 
                        onChange={(e) => setEditValues({
                          ...editValues, 
                          price: poundsToCents(parseFloat(e.target.value))
                        })}
                        className="h-8 w-24"
                      />
                    ) : (
                      formatPrice(variant.price)
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Input 
                        type="number"
                        value={editValues.stock} 
                        onChange={(e) => setEditValues({
                          ...editValues, 
                          stock: parseInt(e.target.value)
                        })}
                        className="h-8 w-20"
                      />
                    ) : (
                      variant.stock
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {isEditing ? (
                        <>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600" onClick={() => handleSave(variant.id)}>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600" onClick={handleCancel}>
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleEdit(variant)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600" onClick={() => onDelete(variant.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
