'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { getVariantAttributes, VariantAttribute } from '@/lib/api/products';

interface VariantSelectorProps {
  storeId: string;
  onGenerate: (selection: { attributeIds: string[]; attributeValueIds: string[] }) => void;
  loading?: boolean;
}

export function VariantSelector({ storeId, onGenerate, loading }: VariantSelectorProps) {
  const [attributes, setAttributes] = useState<VariantAttribute[]>([]);
  const [fetching, setFetching] = useState(true);
  
  // Selection state
  // Map of attributeId -> Set of selected valueIds
  const [selectedValues, setSelectedValues] = useState<Record<string, string[]>>({});
  const [selectedAttributeIds, setSelectedAttributeIds] = useState<string[]>([]);

  useEffect(() => {
    async function loadAttributes() {
      try {
        const data = await getVariantAttributes(storeId);
        setAttributes(data);
      } catch (err) {
        console.error('Failed to load attributes:', err);
      } finally {
        setFetching(false);
      }
    }
    loadAttributes();
  }, [storeId]);

  const handleAddAttribute = (attributeId: string) => {
    if (!selectedAttributeIds.includes(attributeId)) {
      setSelectedAttributeIds([...selectedAttributeIds, attributeId]);
      setSelectedValues({ ...selectedValues, [attributeId]: [] });
    }
  };

  const handleRemoveAttribute = (attributeId: string) => {
    setSelectedAttributeIds(selectedAttributeIds.filter(id => id !== attributeId));
    const newValues = { ...selectedValues };
    delete newValues[attributeId];
    setSelectedValues(newValues);
  };

  const handleValueChange = (attributeId: string, values: string[]) => {
    setSelectedValues({
      ...selectedValues,
      [attributeId]: values
    });
  };

  const handleGenerate = () => {
    // Flatten all selected value IDs
    const allValueIds = Object.values(selectedValues).flat();
    
    if (selectedAttributeIds.length === 0 || allValueIds.length === 0) {
      return;
    }

    onGenerate({
      attributeIds: selectedAttributeIds,
      attributeValueIds: allValueIds
    });
  };

  if (fetching) {
    return <div className="p-4 text-center text-muted-foreground">Loading attributes...</div>;
  }

  // Filter out already selected attributes for the dropdown
  const availableAttributes = attributes.filter(
    attr => !selectedAttributeIds.includes(attr.id)
  );

  const totalCombinations = Object.values(selectedValues).reduce(
    (acc, values) => acc * (values.length || 1),
    selectedAttributeIds.length > 0 ? 1 : 0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Select Attributes</h3>
        
        {availableAttributes.length > 0 && (
          <Select onValueChange={handleAddAttribute}>
            <SelectTrigger className="w-[200px]">
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <SelectValue placeholder="Add Attribute" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {availableAttributes.map(attr => (
                <SelectItem key={attr.id} value={attr.id}>
                  {attr.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {selectedAttributeIds.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed rounded-lg text-muted-foreground">
          No attributes selected. Add attributes like Color or Size to generate variants.
        </div>
      ) : (
        <div className="space-y-6">
          {selectedAttributeIds.map(attrId => {
            const attribute = attributes.find(a => a.id === attrId);
            if (!attribute) return null;

            return (
              <Card key={attrId}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base font-semibold">{attribute.name}</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRemoveAttribute(attrId)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <ToggleGroup 
                    type="multiple" 
                    variant="outline"
                    value={selectedValues[attrId] || []}
                    onValueChange={(values) => handleValueChange(attrId, values)}
                    className="justify-start flex-wrap gap-2"
                  >
                    {attribute.values.map(value => (
                      <ToggleGroupItem 
                        key={value.id} 
                        value={value.id}
                        aria-label={`Select ${value.value}`}
                      >
                        {value.value}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </CardContent>
              </Card>
            );
          })}

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Estimated variants: <span className="font-medium text-foreground">{totalCombinations}</span>
            </div>
            <Button 
              onClick={handleGenerate} 
              disabled={loading || totalCombinations === 0}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Variants
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
